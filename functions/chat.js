const MODEL_NAME = "gpt-4.1-mini";
const REQUEST_TIMEOUT_MS = 15000;
const BACKEND_UNAVAILABLE_MESSAGE = "The AI backend is temporarily unavailable. Please try again shortly.";

// All text limits count UTF-8 bytes, not JavaScript string length or tokens.
// Current six-entry site context <= 2,104 bytes; five-entry fallback <= 1,799.
// Allow growth while bounding parsing and the combined dynamic provider input.
const MAX_BODY_BYTES = 64 * 1024;
const MAX_MESSAGE_BYTES = 4 * 1024;
const MAX_HISTORY_ENTRIES = 6;
const MAX_HISTORY_CONTENT_BYTES = 8 * 1024;
const MAX_HISTORY_ROLE_BYTES = 32;
const MAX_CONTEXT_BYTES = 8 * 1024;
const MAX_INPUT_BYTES = 32 * 1024;
const encoder = new TextEncoder();

class InputError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function readJsonBody(request) {
  const lengthHeader = request.headers.get("Content-Length");
  let declaredLength;
  if (lengthHeader !== null) {
    if (!/^\d+$/.test(lengthHeader)) {
      void request.body?.cancel().catch(() => {});
      throw new InputError(400, "Invalid request body.");
    }
    declaredLength = Number(lengthHeader);
    if (declaredLength > MAX_BODY_BYTES) {
      void request.body?.cancel().catch(() => {});
      throw new InputError(413, "Request body is too large.");
    }
  }

  if (!request.body) throw new InputError(400, "Invalid JSON body.");
  const reader = request.body.getReader();
  const bytes = new Uint8Array(MAX_BODY_BYTES);
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (size + value.byteLength > MAX_BODY_BYTES) {
        // Do not wait for an untrusted source's cancellation promise or read on.
        void reader.cancel().catch(() => {});
        throw new InputError(413, "Request body is too large.");
      }
      bytes.set(value, size);
      size += value.byteLength;
    }
  } finally {
    reader.releaseLock();
  }
  if (declaredLength !== undefined && declaredLength !== size) {
    throw new InputError(400, "Request body length does not match Content-Length.");
  }
  // Decode only after bounding the complete body; reject malformed UTF-8.
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, size)));
}

function validateInput(body) {
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const invalid = () => { throw new InputError(400, "Invalid chat request."); };
  const boundedTextSize = (value, limit) => {
    if (typeof value !== "string") invalid();
    const size = encoder.encode(value).byteLength;
    if (size > limit) throw new InputError(413, "Chat input is too large.");
    return size;
  };

  if (!isObject(body)) invalid();
  // Omitted optional fields retain their previous defaults. Supplied fields
  // must have the right types; extra metadata (such as sources) stays ignored.
  const { message, history = [], contextBlock = "" } = body;
  let inputSize = boundedTextSize(message, MAX_MESSAGE_BYTES);
  if (!message.trim() || !Array.isArray(history)) invalid();
  if (history.length > MAX_HISTORY_ENTRIES) throw new InputError(413, "Chat history is too large.");
  inputSize += boundedTextSize(contextBlock, MAX_CONTEXT_BYTES);
  for (const item of history) {
    if (!isObject(item)) invalid();
    inputSize += boundedTextSize(item.content, MAX_HISTORY_CONTENT_BYTES);
    // Non-assistant roles still normalize to user; do not permit huge role text.
    if (item.role !== undefined) boundedTextSize(item.role, MAX_HISTORY_ROLE_BYTES);
  }
  if (inputSize > MAX_INPUT_BYTES) throw new InputError(413, "Combined chat input is too large.");
  return { message: message.trim(), history, contextBlock };
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history.slice(-6).map((item) => {
    const role = item?.role === "assistant" ? "assistant" : "user";
    const content = typeof item?.content === "string" ? item.content : "";
    return {
      role,
      content,
    };
  });
}

function buildPayload({ history, message, contextBlock }) {
  const messages = [
    {
      role: "developer",
      content: `You are rAIzor, a friendly cat-inspired guide for Asif Rasool's site.
You only answer using the provided context drawn from Asif's resume, CV, and site files.
If the context does not contain the answer, say you don't know yet.
When the user only greets (hi/hello/hey), reply briefly and ask what they want to know about Asif (work, research, projects, education), instead of volunteering a biography.
If a question is vague, ask a focused follow-up. Keep answers concise, direct, and helpful.`,
    },
    ...normalizeHistory(history),
    {
      role: "user",
      content: `Context (from Asif's resume, CV, and site):
${contextBlock}

Question: ${message}

Use only the context above and clearly state when information is not available.`,
    },
  ];

  return {
    model: MODEL_NAME,
    messages,
    temperature: 0.25,
    max_tokens: 512,
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json({ error: BACKEND_UNAVAILABLE_MESSAGE }, { status: 500 });
  }

  let input;
  try {
    input = validateInput(await readJsonBody(request));
  } catch (error) {
    return Response.json(
      { error: error instanceof InputError ? error.message : "Invalid request body." },
      { status: error instanceof InputError ? error.status : 400 },
    );
  }

  const payload = buildPayload(input);
  const url = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return Response.json(
        { error: BACKEND_UNAVAILABLE_MESSAGE },
        { status: 502 },
      );
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      return Response.json({ error: BACKEND_UNAVAILABLE_MESSAGE }, { status: 502 });
    }

    const reply = typeof result?.choices?.[0]?.message?.content === "string"
      ? result.choices[0].message.content.trim()
      : "";

    if (!reply) {
      return Response.json({ error: BACKEND_UNAVAILABLE_MESSAGE }, { status: 502 });
    }

    return Response.json({ reply });
  } catch {
    return Response.json({ error: BACKEND_UNAVAILABLE_MESSAGE }, { status: 502 });
  }
}
