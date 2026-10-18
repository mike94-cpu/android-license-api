
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Android License API",
    status: "online",
    version: "1.0.0"
  });
});

app.post("/license/validate", (req, res) => {
  const { key } = req.body || {};

  if (!key || typeof key !== "string") {
    return res.status(400).json({
      valid: false,
      message: "License key is required"
    });
  }

  // Validation temporaire : aucune licence n'est encore enregistrée.
  return res.status(403).json({
    valid: false,
    message: "License not found"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`License API running on port ${PORT}`);
});
