const express = require("express");

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Greeting endpoint
app.get("/api/hello", (req, res) => {
  const name = req.query.name || "world";
  res.json({ message: `Hello, ${name}!` });
});

// Simple add endpoint to exercise some logic in tests
app.post("/api/add", (req, res) => {
  const { a, b } = req.body || {};
  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({ error: "a and b must be numbers" });
  }
  res.json({ result: a + b });
});

module.exports = app;
