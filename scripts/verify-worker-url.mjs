import assert from "node:assert/strict";
import { resolveWorkerUrl } from "../src/workerUrl.js";

assert.equal(resolveWorkerUrl("https://worker.example/api/", "interpret"), "https://worker.example/api/interpret");
assert.equal(resolveWorkerUrl("https://worker.example/api/image?ignored=1#frag", "health"), "https://worker.example/api/health");
assert.equal(resolveWorkerUrl("https://worker.example/api/transcribe", "image"), "https://worker.example/api/image");
assert.equal(resolveWorkerUrl("https://worker.example", "health"), "https://worker.example/health");
assert.equal(resolveWorkerUrl("http://localhost:8787/interpret", "interpret"), "http://localhost:8787/interpret");
assert.equal(resolveWorkerUrl("http://127.0.0.1:8787/health", "image"), "http://127.0.0.1:8787/image");
assert.throws(() => resolveWorkerUrl("http://worker.example", "health"), /HTTPS/);
assert.throws(() => resolveWorkerUrl("https://user:pass@worker.example", "health"), /Zugangsdaten/);
assert.throws(() => resolveWorkerUrl("https://worker.example", "unknown"), /Unbekannte Worker-Funktion/);
assert.throws(() => resolveWorkerUrl("", "health"), /Worker-Adresse/);
console.log("Worker URL normalization tests passed: 10");
