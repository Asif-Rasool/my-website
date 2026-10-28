import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import { buildSync } from "esbuild";
import { renderToStaticMarkup } from "react-dom/server";
import { onRequestPost } from "../functions/chat.js";
import { knowledgeBase } from "../src/data/raizorKnowledge.js";

const require = createRequire(import.meta.url);
const PRIVATE_DETAIL = "AUDIT_PRIVATE_DIAGNOSTIC";
const BACKEND_ERROR = "The AI backend is temporarily unavailable. Please try again shortly.";
const FRONTEND_ERROR = "rAIzor's AI backend is temporarily unavailable. Please try again shortly.";
const question = "Tell me about SmartField LA.";

function request(body = { message: question, history: [], contextBlock: "Site context" }) {
  return new Request("https://local-test.invalid/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function invoke(body, env = { OPENAI_API_KEY: "dummy-test-key" }) {
  return onRequestPost({ request: request(body), env });
}

async function assertSafeFailure(response, status = 502) {
  assert.equal(response.status, status);
  assert.match(response.headers.get("Content-Type"), /application\/json/);
  assert.deepEqual(await response.json(), { error: BACKEND_ERROR });
}

test("Function preserves successful replies, history, context, model, and limits", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/chat/completions");
    assert.equal(options.method, "POST");
    assert.equal(options.headers.Authorization, "Bearer dummy-test-key");
    const payload = JSON.parse(options.body);
    assert.equal(payload.model, "gpt-4.1-mini");
    assert.equal(payload.max_tokens, 512);
    assert.equal(payload.messages[0].role, "developer");
    assert.equal(payload.messages[1].content, "Previous answer");
    assert.match(payload.messages.at(-1).content, /Site context/);
    assert.match(payload.messages.at(-1).content, /SmartField LA/);
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ choices: [{ message: { content: "  Helpful answer  " } }] });
  });
  const response = await invoke({ message: question, contextBlock: "Site context", history: [{ role: "assistant", content: "Previous answer" }] });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { reply: "Helpful answer" });
});

for (const status of [401, 429, 500]) {
  test(`Function hides provider ${status} details without reading the error body`, async (t) => {
    let bodyRead = false;
    t.mock.method(globalThis, "fetch", async () => ({
      ok: false,
      status,
      text() { bodyRead = true; return PRIVATE_DETAIL; },
    }));
    await assertSafeFailure(await invoke());
    assert.equal(bodyRead, false);
  });
}

test("Function hides invalid provider JSON and empty replies", async (t) => {
  for (const makeResponse of [
    () => new Response(`<html>${PRIVATE_DETAIL}</html>`, { headers: { "Content-Type": "text/html" } }),
    () => Response.json({ choices: [] }),
    () => Response.json({ choices: [{ message: { content: " " } }] }),
  ]) {
    const mock = t.mock.method(globalThis, "fetch", async () => makeResponse());
    await assertSafeFailure(await invoke());
    mock.mock.restore();
  }
});

test("Function hides internal network exceptions", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new Error(PRIVATE_DETAIL); });
  await assertSafeFailure(await invoke());
});

test("Function timeout retains its 15-second deadline and returns a safe error", async (t) => {
  t.mock.method(AbortSignal, "timeout", (milliseconds) => {
    assert.equal(milliseconds, 15000);
    return AbortSignal.abort(new DOMException(PRIVATE_DETAIL, "TimeoutError"));
  });
  t.mock.method(globalThis, "fetch", async (_url, options) => options.signal.throwIfAborted());
  await assertSafeFailure(await invoke());
});

test("Function rejects invalid request JSON and empty messages without calling a provider", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected provider call"); });
  for (const body of ["{", { message: " " }, { message: 123 }]) {
    const response = await invoke(body);
    assert.equal(response.status, 400);
    assert.ok((await response.json()).error);
  }
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("Function hides missing configuration and does not call a provider", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected provider call"); });
  await assertSafeFailure(await invoke(undefined, {}), 500);
  assert.equal(fetchMock.mock.callCount(), 0);
});

// Compile the actual component in memory. A small hook harness drives its real
// event handlers without a browser, new dependencies, or generated test files.
const componentCode = buildSync({
  stdin: {
    contents: readFileSync(new URL("../src/pages/ChatWithRazor.jsx", import.meta.url), "utf8")
      + "\nexport { buildContext, buildLocalFallback, suggestedQuestions };",
    resolveDir: fileURLToPath(new URL("../src/pages/", import.meta.url)),
    loader: "jsx",
  },
  bundle: true,
  write: false,
  platform: "node",
  format: "cjs",
  jsx: "automatic",
  external: ["react", "react/jsx-runtime"],
  define: { "import.meta.env": "{}" },
}).outputFiles[0].text;

function findAll(element, predicate) {
  if (Array.isArray(element)) return element.flatMap((child) => findAll(child, predicate));
  if (!element || typeof element !== "object") return [];
  return [...(predicate(element) ? [element] : []), ...findAll(element.props?.children, predicate)];
}

function mountChat(fetchMock, { timeout = false } = {}) {
  const state = [];
  let cursor = 0;
  const module = { exports: {} };
  const hooks = {
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
      return [state[index], (next) => { state[index] = typeof next === "function" ? next(state[index]) : next; }];
    },
    useRef: () => ({ current: null }),
    useEffect() {},
  };
  vm.runInNewContext(componentCode, {
    module,
    exports: module.exports,
    require: (name) => name === "react" ? hooks : require(name),
    fetch: fetchMock,
    AbortSignal: {
      timeout(milliseconds) {
        assert.equal(milliseconds, 20000);
        return timeout ? AbortSignal.abort(new DOMException(PRIVATE_DETAIL, "TimeoutError")) : AbortSignal.timeout(milliseconds);
      },
    },
  });
  const render = () => { cursor = 0; return module.exports.default(); };
  const find = (type) => findAll(render(), (node) => node.type === type)[0];
  return {
    render,
    buildContext: module.exports.buildContext,
    buildLocalFallback: module.exports.buildLocalFallback,
    suggestedQuestions: module.exports.suggestedQuestions,
    html: () => renderToStaticMarkup(render()),
    async submit(text = question) {
      find("input").props.onChange({ target: { value: text } });
      await find("form").props.onSubmit({ preventDefault() {} });
    },
  };
}

test("Chat UI preserves POST /chat, history, successful answers, suggestions, and follow-ups", async () => {
  let calls = 0;
  const chat = mountChat(async (url, options) => {
    calls++;
    assert.equal(url, "/chat");
    assert.equal(options.method, "POST");
    assert.equal(options.headers["Content-Type"], "application/json");
    const body = JSON.parse(options.body);
    assert.equal(body.message, question);
    assert.equal(body.history.at(-1).content, question);
    assert.match(body.contextBlock, /SmartField-LA/);
    if (calls === 2) assert.ok(body.history.some((item) => item.content === "Helpful answer"));
    return Response.json({ reply: "Helpful answer" });
  });
  await chat.submit();
  assert.match(chat.html(), /Helpful answer/);
  assert.match(chat.html(), /Try a follow-up/);
  assert.match(chat.html(), /What is Asif working on right now/);
  assert.doesNotMatch(chat.html(), /inline-alert/);
  await chat.submit();
  assert.equal(calls, 2);
});

const frontendFailures = [
  ["Cloudflare HTML 502", async () => {
    const response = new Response(`<html><title>502 Host Error</title>${PRIVATE_DETAIL}</html>`, {
      status: 502,
      headers: { "Content-Type": "text/html" },
    });
    response.text = () => { throw new Error("HTML error bodies must not be read"); };
    return response;
  }],
  ["provider error JSON", async () => Response.json({ error: PRIVATE_DETAIL, details: PRIVATE_DETAIL }, { status: 502 })],
  ["invalid successful JSON", async () => new Response(`<html>${PRIVATE_DETAIL}</html>`, { status: 200 })],
  ["error field on HTTP 200", async () => Response.json({ error: PRIVATE_DETAIL })],
  ["empty reply", async () => Response.json({ reply: " " })],
  ["network exception", async () => { throw new Error(PRIVATE_DETAIL); }],
  ["request timeout", async (_url, options) => options.signal.throwIfAborted()],
];

for (const [name, fetchMock] of frontendFailures) {
  test(`Chat UI preserves fallback and hides diagnostics for ${name}`, async () => {
    const chat = mountChat(fetchMock, { timeout: name === "request timeout" });
    await chat.submit();
    const tree = chat.render();
    const alert = findAll(tree, (node) => node.props?.className === "inline-alert")[0];
    assert.equal(alert.props.children, FRONTEND_ERROR);
    const html = chat.html();
    assert.match(html, /Here is what I can share from the on-page sources/);
    assert.match(html, /HCI case study on SmartField-LA/);
    assert.match(html, /Try a follow-up/);
    assert.doesNotMatch(html, /AUDIT_PRIVATE_DIAGNOSTIC|Error bodies must not be read|HTML error bodies must not be read|OPENAI_API_KEY/);
    assert.equal(findAll(tree, (node) => node.type === "input")[0].props.disabled, false);
    assert.equal(findAll(tree, (node) => node.type === "input")[0].props.value, "");
  });
}

test("Chat UI still answers greetings locally without a network request", async () => {
  const chat = mountChat(async () => { throw new Error("Unexpected network request"); });
  await chat.submit("hello");
  assert.match(chat.html(), /What would you like to know about Asif/);
  assert.doesNotMatch(chat.html(), /inline-alert/);
});

// Policy values are asserted independently of the implementation constants.
const BODY_BYTES = 65536;
const MESSAGE_BYTES = 4096;
const HISTORY_BYTES = 8192;
const CONTEXT_BYTES = 8192;
const INPUT_BYTES = 32768;
const utf8Size = (value) => Buffer.byteLength(value, "utf8");

function mockSuccess(t) {
  return t.mock.method(globalThis, "fetch", async () => Response.json({
    choices: [{ message: { content: "Helpful answer" } }],
  }));
}

async function assertRejected(req, status, fetchMock) {
  const response = await onRequestPost({ request: req, env: { OPENAI_API_KEY: "dummy-test-key" } });
  assert.equal(response.status, status);
  assert.equal(fetchMock.mock.callCount(), 0, "Rejected inputs must never reach the provider");
  const body = await response.json();
  assert.equal(typeof body.error, "string");
  assert.deepEqual(Object.keys(body), ["error"]);
  assert.doesNotMatch(body.error, /AUDIT_PRIVATE_DIAGNOSTIC|OPENAI_API_KEY|stack|SyntaxError/);
}

function rawRequest(text, headers = {}) {
  return new Request("https://local-test.invalid/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: text,
  });
}

function streamedRequest(chunks, { headers = {}, streamError = false, pendingCancel = false } = {}) {
  const state = { pulls: 0, cancelled: false };
  const stream = new ReadableStream({
    pull(controller) {
      const index = state.pulls++;
      if (streamError) controller.error(new Error(PRIVATE_DETAIL));
      else if (index < chunks.length) controller.enqueue(chunks[index]);
      else controller.close();
    },
    cancel() {
      state.cancelled = true;
      if (pendingCancel) return new Promise(() => {});
    },
  }, { highWaterMark: 0 });
  const req = new Request("https://local-test.invalid/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: stream,
    duplex: "half",
  });
  return { req, state };
}

test("All current knowledge contexts and representative fallback conversations fit the limits", async (t) => {
  const fetchMock = mockSuccess(t);
  const chat = mountChat(async () => { throw new Error("Unexpected browser network request"); });
  const format = (entry) => `${entry.title} [${entry.source}]: ${entry.content}`;
  const maxContext = knowledgeBase.map(format).sort((a, b) => utf8Size(b) - utf8Size(a)).slice(0, 6).join("\n\n");
  const maxFallback = "I could not reach ChatGPT right now. Here is what I can share from the on-page sources:\n"
    + knowledgeBase.map((entry) => `- ${entry.title}: ${entry.content}`)
      .sort((a, b) => utf8Size(b) - utf8Size(a)).slice(0, 5).join("\n");
  assert.ok(utf8Size(maxContext) <= CONTEXT_BYTES);
  assert.ok(utf8Size(maxFallback) <= HISTORY_BYTES);
  let maxBody = 0;
  for (const message of [...chat.suggestedQuestions, "Compare his projects and publications.", "Tell me about his dissertation."]) {
    const contextBlock = chat.buildContext(message).block;
    const history = Array.from({ length: 6 }, (_, index) => ({
      role: index % 2 ? "user" : "assistant",
      content: index % 2 ? message : chat.buildLocalFallback(message),
      sources: ["Existing UI metadata"],
    }));
    const body = { message, contextBlock, history };
    maxBody = Math.max(maxBody, utf8Size(JSON.stringify(body)));
    assert.equal((await invoke(body)).status, 200);
  }
  assert.equal((await invoke({ message: question, contextBlock: maxContext, history: [{ role: "assistant", content: maxFallback }] })).status, 200);
  assert.equal(fetchMock.mock.callCount(), 7);
  t.diagnostic(`Current knowledge entries: ${knowledgeBase.length}; maximum context: ${utf8Size(maxContext)} bytes; maximum fallback: ${utf8Size(maxFallback)} bytes; representative body including sources metadata: ${maxBody} bytes.`);
});

const validBoundaries = [
  ["message", { message: "m".repeat(MESSAGE_BYTES) }],
  ["context", { message: "ok", contextBlock: "c".repeat(CONTEXT_BYTES) }],
  ["history content", { message: "ok", history: [{ content: "h".repeat(HISTORY_BYTES) }] }],
  ["six history entries", { message: "ok", history: Array.from({ length: 6 }, () => ({ role: "user", content: "previous question" })) }],
  ["role", { message: "ok", history: [{ role: "r".repeat(32), content: "previous question" }] }],
  ["aggregate", { message: "m".repeat(MESSAGE_BYTES), contextBlock: "c".repeat(CONTEXT_BYTES), history: [8192, 8192, 4096].map((size) => ({ role: "assistant", content: "h".repeat(size) })) }],
  ["multibyte aggregate", { message: "🐈".repeat(1024), contextBlock: "🐈".repeat(2048), history: [2048, 2048, 1024].map((size) => ({ content: "🐈".repeat(size) })) }],
  ["emoji message", { message: "🐈".repeat(MESSAGE_BYTES / 4) }],
  ["multibyte context", { message: "ok", contextBlock: "界".repeat(2730) + "ab" }],
  ["emoji history", { message: "ok", history: [{ content: "🐈".repeat(HISTORY_BYTES / 4) }] }],
];

for (const [name, body] of validBoundaries) {
  test(`Accepts the exact ${name} boundary without truncation`, async (t) => {
    const fetchMock = mockSuccess(t);
    assert.equal((await invoke(body)).status, 200);
    assert.equal(fetchMock.mock.callCount(), 1);
    const payload = JSON.parse(fetchMock.mock.calls[0].arguments[1].body);
    assert.ok(payload.messages.at(-1).content.includes(body.message));
    if (body.contextBlock) assert.ok(payload.messages.at(-1).content.includes(body.contextBlock));
    for (const [index, item] of (body.history || []).entries()) assert.equal(payload.messages[index + 1].content, item.content);
    if (name.includes("aggregate")) assert.equal(utf8Size(body.message + body.contextBlock + body.history.map((item) => item.content).join("")), INPUT_BYTES);
  });
}

const invalidSchemas = [
  ["null root", null], ["array root", []], ["string root", "\"text\""],
  ["number root", 123], ["boolean root", true], ["missing message", {}],
  ["null message", { message: null }], ["array message", { message: [] }],
  ["object message", { message: {} }], ["empty message", { message: "" }],
  ["whitespace message", { message: " \t\n" }],
  ["null history", { message: "ok", history: null }],
  ["object history", { message: "ok", history: {} }],
  ["string history", { message: "ok", history: "previous" }],
  ["null entry", { message: "ok", history: [null] }],
  ["array entry", { message: "ok", history: [[]] }],
  ["string entry", { message: "ok", history: ["previous"] }],
  ["missing content", { message: "ok", history: [{ role: "user" }] }],
  ["null content", { message: "ok", history: [{ content: null }] }],
  ["numeric content", { message: "ok", history: [{ content: 123 }] }],
  ["null role", { message: "ok", history: [{ role: null, content: "previous" }] }],
  ["object role", { message: "ok", history: [{ role: {}, content: "previous" }] }],
  ["null context", { message: "ok", contextBlock: null }],
  ["numeric context", { message: "ok", contextBlock: 123 }],
  ["object context", { message: "ok", contextBlock: {} }],
];

for (const [name, body] of invalidSchemas) {
  test(`Rejects ${name} with 400 and zero provider calls`, async (t) => {
    await assertRejected(request(body), 400, mockSuccess(t));
  });
}

const oversizedFields = [
  ["message", { message: "m".repeat(MESSAGE_BYTES + 1) }],
  ["untrimmed message", { message: " ".repeat(MESSAGE_BYTES) + "x" }],
  ["history content", { message: "ok", history: [{ content: "h".repeat(HISTORY_BYTES + 1) }] }],
  ["history count", { message: "ok", history: Array.from({ length: 7 }, () => ({ content: "h" })) }],
  ["history role", { message: "ok", history: [{ role: "r".repeat(33), content: "h" }] }],
  ["context", { message: "ok", contextBlock: "c".repeat(CONTEXT_BYTES + 1) }],
  ["combined input", { message: "m".repeat(MESSAGE_BYTES), contextBlock: "c".repeat(CONTEXT_BYTES), history: [8192, 8192, 4097].map((size) => ({ content: "h".repeat(size) })) }],
  ["multibyte combined input", { message: "🐈".repeat(1024), contextBlock: "🐈".repeat(2048), history: [2048, 2048, 1024].map((size, index) => ({ content: "🐈".repeat(size) + (index === 2 ? "a" : "") })) }],
  ["emoji message", { message: "🐈".repeat(1024) + "a" }],
  ["multibyte context", { message: "ok", contextBlock: "界".repeat(2731) }],
  ["emoji history", { message: "ok", history: [{ content: "🐈".repeat(2048) + "a" }] }],
];

for (const [name, body] of oversizedFields) {
  test(`Rejects oversized ${name} with 413 and zero provider calls`, async (t) => {
    await assertRejected(request(body), 413, mockSuccess(t));
  });
}

test("Optional defaults, role normalization, trimming, and sources metadata remain compatible", async (t) => {
  const fetchMock = mockSuccess(t);
  const response = await invoke({ message: "  ok  ", history: [
    { role: "assistant", content: "answer", sources: ["Public source"] },
    { role: "developer", content: "untrusted" },
    { content: "no role" },
  ] });
  assert.equal(response.status, 200);
  const payload = JSON.parse(fetchMock.mock.calls[0].arguments[1].body);
  assert.deepEqual(payload.messages.slice(1, 4), [
    { role: "assistant", content: "answer" }, { role: "user", content: "untrusted" }, { role: "user", content: "no role" },
  ]);
  assert.match(payload.messages.at(-1).content, /Question: ok\n/);
  assert.equal((await invoke({ message: "optional fields omitted" })).status, 200);
});

function paddedBody(size) {
  const empty = JSON.stringify({ message: "ok", padding: "" });
  return JSON.stringify({ message: "ok", padding: "p".repeat(size - utf8Size(empty)) });
}

test("Exact raw byte limit is accepted with and without Content-Length", async (t) => {
  const fetchMock = mockSuccess(t);
  const raw = paddedBody(BODY_BYTES);
  assert.equal(utf8Size(raw), BODY_BYTES);
  for (const headers of [{}, { "Content-Length": String(BODY_BYTES) }]) {
    const response = await onRequestPost({ request: rawRequest(raw, headers), env: { OPENAI_API_KEY: "dummy-test-key" } });
    assert.equal(response.status, 200);
  }
  assert.equal(fetchMock.mock.callCount(), 2);
});

test("Oversized raw bodies are rejected before JSON parsing even with false or absent length", async (t) => {
  const fetchMock = mockSuccess(t);
  for (const headers of [{}, { "Content-Length": "1" }, { "Content-Length": String(BODY_BYTES + 1) }]) {
    const req = rawRequest("!".repeat(BODY_BYTES + 1), headers);
    const parseMock = t.mock.method(JSON, "parse");
    const response = await onRequestPost({ request: req, env: { OPENAI_API_KEY: "dummy-test-key" } });
    assert.equal(parseMock.mock.callCount(), 0);
    parseMock.mock.restore();
    assert.equal(response.status, 413);
    assert.equal(fetchMock.mock.callCount(), 0);
  }
});

test("JSON escape expansion is measured separately from decoded field bytes", async (t) => {
  mockSuccess(t);
  const raw = '{"message":"' + "\\u0061".repeat(MESSAGE_BYTES) + '"}';
  assert.ok(utf8Size(raw) < BODY_BYTES);
  assert.equal((await onRequestPost({ request: rawRequest(raw), env: { OPENAI_API_KEY: "dummy-test-key" } })).status, 200);
});

test("Malformed and mismatched Content-Length headers are rejected with zero provider calls", async (t) => {
  const fetchMock = mockSuccess(t);
  const raw = JSON.stringify({ message: "ok" });
  for (const length of ["-1", "invalid", "1.5", "1e2", "", "0", "1", String(utf8Size(raw) + 1)]) {
    await assertRejected(rawRequest(raw, { "Content-Length": length }), 400, fetchMock);
  }
});

test("An oversized declared length cancels the body before reading it", async (t) => {
  const fetchMock = mockSuccess(t);
  const { req, state } = streamedRequest([new TextEncoder().encode('{"message":"ok"}')], {
    headers: { "Content-Length": String(BODY_BYTES + 1) }, pendingCancel: true,
  });
  await assertRejected(req, 413, fetchMock);
  assert.equal(state.pulls, 0);
  assert.equal(state.cancelled, true);
});

test("Chunked Unicode body without Content-Length survives splits inside UTF-8 characters", async (t) => {
  const fetchMock = mockSuccess(t);
  const raw = new TextEncoder().encode(JSON.stringify({ message: "🐈你好", history: [], contextBlock: "résumé" }));
  const { req } = streamedRequest(Array.from(raw, (byte) => Uint8Array.of(byte)));
  assert.equal(req.headers.get("Content-Length"), null);
  const response = await onRequestPost({ request: req, env: { OPENAI_API_KEY: "dummy-test-key" } });
  assert.equal(response.status, 200);
  const payload = JSON.parse(fetchMock.mock.calls[0].arguments[1].body);
  assert.match(payload.messages.at(-1).content, /🐈你好/);
  assert.match(payload.messages.at(-1).content, /résumé/);
});

test("An exact-limit streamed body without Content-Length is accepted", async (t) => {
  const fetchMock = mockSuccess(t);
  const raw = new TextEncoder().encode(paddedBody(BODY_BYTES));
  const { req, state } = streamedRequest([raw.subarray(0, 32768), raw.subarray(32768)]);
  assert.equal(req.headers.get("Content-Length"), null);
  assert.equal((await onRequestPost({ request: req, env: { OPENAI_API_KEY: "dummy-test-key" } })).status, 200);
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.equal(state.cancelled, false);
});

test("Oversized streams stop at the first excess byte without reading or waiting on the tail", async (t) => {
  const fetchMock = mockSuccess(t);
  for (const headers of [{}, { "Content-Length": "1" }]) {
    const { req, state } = streamedRequest([
      new Uint8Array(BODY_BYTES), Uint8Array.of(32), new Uint8Array(1000),
    ], { headers, pendingCancel: true });
    await assertRejected(req, 413, fetchMock);
    assert.equal(state.pulls, 2);
    assert.equal(state.cancelled, true);
  }
});

test("A single oversized stream chunk is rejected without reading the tail", async (t) => {
  const fetchMock = mockSuccess(t);
  const { req, state } = streamedRequest([new Uint8Array(BODY_BYTES + 1), Uint8Array.of(32)]);
  await assertRejected(req, 413, fetchMock);
  assert.equal(state.pulls, 1);
  assert.equal(state.cancelled, true);
});

test("Stream read errors and malformed UTF-8 have safe 400 responses", async (t) => {
  const fetchMock = mockSuccess(t);
  const failing = streamedRequest([], { streamError: true });
  await assertRejected(failing.req, 400, fetchMock);
  const invalidUtf8 = streamedRequest([Uint8Array.of(0xff)]);
  await assertRejected(invalidUtf8.req, 400, fetchMock);
});

test("Real frontend requests pass validation and rejected inputs retain the local fallback", async (t) => {
  const fetchMock = mockSuccess(t);
  const chat = mountChat(async (_url, options) => onRequestPost({
    request: new Request("https://local-test.invalid/chat", options), env: { OPENAI_API_KEY: "dummy-test-key" },
  }));
  await chat.submit();
  await chat.submit();
  assert.equal(fetchMock.mock.callCount(), 2);
  assert.match(chat.html(), /Helpful answer/);
  assert.doesNotMatch(chat.html(), /inline-alert/);
  await chat.submit("m".repeat(MESSAGE_BYTES + 1));
  assert.equal(fetchMock.mock.callCount(), 2);
  assert.match(chat.html(), /Here is what I can share from the on-page sources/);
  assert.match(chat.html(), /temporarily unavailable/);
});

test("Function runs in local Cloudflare workerd with all provider traffic mocked", async () => {
  const { Miniflare, createFetchMock } = await import("miniflare");
  const fetchMock = createFetchMock();
  fetchMock.disableNetConnect();
  const provider = fetchMock.get("https://api.openai.com");
  provider.intercept({ path: "/v1/chat/completions", method: "POST" })
    .reply(200, { choices: [{ message: { content: "Local runtime answer" } }] });
  provider.intercept({ path: "/v1/chat/completions", method: "POST" })
    .reply(502, `<html>${PRIVATE_DETAIL}</html>`);
  const source = readFileSync(new URL("../functions/chat.js", import.meta.url), "utf8");
  const runtime = new Miniflare({
    modules: true,
    script: `${source}\nexport default { fetch(request, env) { return onRequestPost({ request, env }); } };`,
    compatibilityDate: "2025-11-25",
    cf: false,
    bindings: { OPENAI_API_KEY: "dummy-test-key" },
    fetchMock,
  });
  try {
    const send = (body = { message: question }) => runtime.dispatchFetch("https://local-test.invalid/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const success = await send();
    assert.equal(success.status, 200);
    assert.deepEqual(await success.json(), { reply: "Local runtime answer" });
    await assertSafeFailure(await send());
    assert.equal((await send(null)).status, 400);
    assert.equal((await send({ message: "x".repeat(MESSAGE_BYTES + 1) })).status, 413);
    assert.equal((await send({ message: "ok", padding: "x".repeat(BODY_BYTES) })).status, 413);
    fetchMock.assertNoPendingInterceptors();
  } finally {
    await runtime.dispose();
    await fetchMock.close();
  }
});
