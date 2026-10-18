
const express = require("express");
const crypto = require("crypto");

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
  const { deviceId } = req.body || {};

  if (typeof deviceId !== "string" || !deviceId.trim()) {
    return res.status(400).json({
      valid: false,
      message: "Device ID required"
    });
  }

  const privateKey = process.env.LICENSE_PRIVATE_KEY;

  if (!privateKey) {
    return res.status(500).json({
      valid: false,
      message: "Server signing key not configured"
    });
  }

  const payload = {
    keyId: "nextscript-p256-700d99dd",
    deviceHash: crypto
      .createHash("sha256")
      .update(deviceId)
      .digest("hex"),
    valid: false,
    message: "Device not authorized"
  };

  const canonical = [
    "NextScript-License-Response-v1",
    payload.keyId,
    payload.deviceHash,
    String(payload.valid),
    payload.message
  ].join("\n");

  const signature = crypto
    .sign("sha256", Buffer.from(canonical), {
      key: privateKey,
      dsaEncoding: "der"
    })
    .toString("base64url");

  res.json({ ...payload, signature });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`License API running on port ${PORT}`);
});
