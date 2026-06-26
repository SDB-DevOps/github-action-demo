const { test } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../src/app");

test("GET /health returns ok", async () => {
  const res = await request(app).get("/health");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, "ok");
});

test("GET /api/hello defaults to world", async () => {
  const res = await request(app).get("/api/hello");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.message, "Hello, world!");
});

test("GET /api/hello uses name query param", async () => {
  const res = await request(app).get("/api/hello").query({ name: "Claude" });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.message, "Hello, Claude!");
});

test("POST /api/add adds two numbers", async () => {
  const res = await request(app).post("/api/add").send({ a: 2, b: 3 });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.result, 5);
});

test("POST /api/add rejects non-numbers", async () => {
  const res = await request(app).post("/api/add").send({ a: "x", b: 3 });
  assert.strictEqual(res.status, 400);
});
