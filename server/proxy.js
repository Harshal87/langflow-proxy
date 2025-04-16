// server/proxy.js (ES module format)

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // <-- This parses JSON POST bodies

// ✅ Route
app.post("/langflow", async (req, res) => {
  const userInput = req.body.input || "hello world!"; // Will now work!
  console.log(userInput)

  const payload = {
    input_value: userInput,
    output_type: "chat",
    input_type: "chat",
    session_id: "user_1"
  };

  try {
    const response = await fetch("https://api.langflow.astra.datastax.com/lf/fb36b4bb-1733-4ceb-9aa6-6d89dda82bde/api/v1/run/181ecc9d-2370-4241-8467-23f8babda741", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer AstraCS:tZptipQHjxhejBeFEUSvZCkw:160720f09491b981a5c55005e0630d33829108c3654616aa2fa5755881060932"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Langflow API error:", errorText);
      return res.status(500).json({ error: "Langflow API failed", details: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    res.status(500).json({ error: "Proxy Server Error", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
