const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "chat.html"));
});

module.exports = app;
