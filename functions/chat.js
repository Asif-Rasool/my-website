const MODEL_NAME = "gemini-2.0-flash";
const REQUEST_TIMEOUT_MS = 15000;

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history.slice(-6).map((item) => {
    const role = item?.role === "assistant" ? "model" : "user";
    const content = typeof item?.content === "string" ? item.content : "";
    return {
      role,
      parts: [{ text: content }],
    };
  });
}

function buildPayload({ history, message, contextBlock }) {
  const contents = [
    ...normalizeHistory(history),
    {
      role: "user",
      parts: [
        {
          text: `Context (from Asif's resume, CV, and site):\n${contextBlock}\n\nQuestion: ${message}\n\nUse only the context above and clearly state when information is not available.`,
        },
      ],
    },
  ];

  return {
    contents,
    system_instruction: {
      parts: [
        {
          text: `You are rAIzor, a friendly cat-inspired guide for Asif Rasool's site.
You only answer using the provided context drawn from Asif's resume, CV, and site files.
If the context does not contain the answer, say you don't know yet.
When the user only greets (hi/hello/hey), reply briefly and ask what they want to know about Asif (work, research, projects, education), instead of volunteering a biography.
If a question is vague, ask a focused follow-up. Keep answers concise, direct, and helpful.`,
        },
      ],
    },
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: 512,
    },
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY is missing in the Cloudflare environment." }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const history = body?.history ?? [];
  const contextBlock = typeof body?.contextBlock === "string" ? body.contextBlock : "";

  if (!message) {
    return Response.json({ error: "The field `message` is required." }, { status: 400 });
  }

  const payload = buildPayload({ history, message, contextBlock });
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return Response.json(
        { error: `Gemini request failed (${response.status}).`, details: errorBody?.slice(0, 2000) ?? "" },
        { status: 502 },
      );
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      return Response.json({ error: "Gemini returned a non-JSON response." }, { status: 502 });
    }

    const reply = result?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim();

    if (!reply) {
      return Response.json({ error: "Gemini returned an empty response." }, { status: 502 });
    }

    return Response.json({ reply });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Unexpected error calling Gemini.";
    return Response.json({ error: messageText }, { status: 502 });
  }
}
