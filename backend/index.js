import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import fetch from "node-fetch";
import OpenAI from 'openai'
import Groq from "groq-sdk";


const model = process.env.OPEN_ROUTER_MODEL
const groqModel = process.env.GROQ_MODEL
const port = process.env.PORT || 3000


const app = express()
app.use(express.json())
app.use(cors())



//Groq Config
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/chat', async (req, res) => {
  const { prompt } = req.body
  
  const response = await groq.chat.completions.create({
    model: groqModel,
    messages: [
      {
        role: "system",
        // content: "You are a knowledgeable and friendly AI assistant named Alex made by Mohammad Suleman. Your role is to help users by answering their questions in a warm and professional tone. answer the questions in very short and precise words, like only to the point"
        content: `
You are a knowledgeable and friendly AI assistant named Alex. 
you are an speech model so act like it, so phrase your answer in a way that it sounds like more human.
Your job is to either answer in short text OR, if the user asks you to do a browser action 
(like open YouTube, Google search, navigate, etc.), 
respond ONLY in strict JSON object like this:

{"action": "open_youtube", "response": "playing despacito in youtube", "query": "despacito song"}
{"action": "open_youtube", "response": "playing javascript tutorial", "query": "javascript tutorial"}
{"action": "google_search", "response": "opening todays ai news ","query": "AI news today"}
{"action": "navigate", "response": "navigating to example.com", "url": "https://example.com"}

Never mix JSON with normal text.
`
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });


  const data = response.choices[0]?.message?.content || ""

  res.status(200).json({ response: data })
  return
})




const server = app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);


