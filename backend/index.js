import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import yts from "yt-search";

const model = process.env.OPEN_ROUTER_MODEL;
const groqModel = process.env.GROQ_MODEL;
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

// Groq Config
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const response = await groq.chat.completions.create({
    model: groqModel,
    messages: [
      {
        role: "system",
        content: `
You are Alex, a speech AI assistant.

If user asks to play a song or music, respond ONLY in JSON:

{"action":"play_youtube","query":"song name"}

Other browser actions:

{"action":"google_search","query":"AI news today"}
{"action":"navigate","url":"https://example.com"}

Otherwise reply with short normal text.

Never mix JSON and text.
`
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const message = response.choices[0]?.message?.content?.trim() || "";

  // Handle JSON actions
  if (message.startsWith("{")) {
    const data = JSON.parse(message);

    // YouTube playback
    if (data.action === "play_youtube") {
      const result = await yts(data.query);

      if (!result.videos.length) {
        return res.json({ error: "No video found" });
      }

      const video = result.videos[0];

      return res.json({
        action: "play_youtube",
        url: `https://www.youtube.com/watch?v=${video.videoId}&autoplay=1`,
        response: `Playing ${video.title}`
      });
    }

    // Other actions pass through
    return res.json(data);
  }

  // Normal text reply
  res.json({ response: message });
});

const server = app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
