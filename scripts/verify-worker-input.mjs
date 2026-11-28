import assert from "node:assert/strict";
import worker, { readBodyLimited, fetchUpstream } from "../worker.js";

const origin = "https://sensoped-preview.example";
const env = { ALLOWED_ORIGIN: origin, OPENAI_API_KEY: "test-only" };

function streamedRequest(path, bytes, headers = {}) {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });
  return new Request("https://worker.test" + path, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", ...headers },
    body,
    duplex: "half"
  });
}


const originalFetch = globalThis.fetch;
globalThis.fetch = async () => new Response("ok", { status: 200 });
const upstreamSuccess = await fetchUpstream("https://api.example.test", {}, 100);
assert.equal(upstreamSuccess.status, 200);
globalThis.fetch = (_url, { signal }) => new Promise((resolve, reject) => {
  if (signal.aborted) reject(new DOMException("Aborted", "AbortError"));
  else signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
});
await assert.rejects(() => fetchUpstream("https://api.example.test", {}, 10), error => error?.status === 504);
globalThis.fetch = originalFetch;

const health = await worker.fetch(new Request("https://worker.test/health"), env);
assert.equal(health.status, 200);
assert.equal((await health.json()).status, "ok");

const preflight = await worker.fetch(new Request("https://worker.test/interpret", {
  method: "OPTIONS",
  headers: { Origin: origin }
}), env);
assert.equal(preflight.status, 204);

const mismatch = await worker.fetch(new Request("https://worker.test/interpret", {
  method: "POST",
  headers: { Origin: "https://other.example", "Content-Type": "application/json" },
  body: JSON.stringify({ findings: { note: "demo" } })
}), env);
assert.equal(mismatch.status, 403);

const noOrigin = await worker.fetch(new Request("https://worker.test/interpret", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ findings: { note: "demo" } })
}), env);
assert.equal(noOrigin.status, 403);

const unknown = await worker.fetch(new Request("https://worker.test/unknown", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: "{}"
}), env);
assert.equal(unknown.status, 404);

const malformed = await worker.fetch(new Request("https://worker.test/interpret", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: "{invalid"
}), env);
assert.equal(malformed.status, 400);

const missingFindings = await worker.fetch(new Request("https://worker.test/interpret", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ other: "demo" })
}), env);
assert.equal(missingFindings.status, 400);

const nestedFindings = await worker.fetch(new Request("https://worker.test/interpret", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ findings: { note: { nested: true } } })
}), env);
assert.equal(nestedFindings.status, 400);

const limit = 200000;
const oversized = streamedRequest("/interpret", new Uint8Array(limit + 1));
const oversizedResponse = await worker.fetch(oversized, env);
assert.equal(oversizedResponse.status, 413);

const acceptedBytes = await readBodyLimited(new Request("https://worker.test/body", {
  method: "POST",
  body: "small-body"
}), 32);
assert.equal(new TextDecoder().decode(acceptedBytes), "small-body");

const directOversize = new Request("https://worker.test/body", {
  method: "POST",
  body: new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(33));
      controller.close();
    }
  }),
  duplex: "half"
});
await assert.rejects(() => readBodyLimited(directOversize, 32), error => error?.status === 413);

console.log("Worker input and route tests passed: 13");
