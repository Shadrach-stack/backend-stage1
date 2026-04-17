const express = require("express");
const app = express();

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API working" });
});

module.exports = app;
