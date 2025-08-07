// src/app/api/summarizer/route.js

import { generateContent } from "../../../lib/gemini"; 
import { summarizerPrompt } from "../../../lib/prompts"; 

export async function POST(req) {
  try {
    const { topic, subject } = await req.json();
    const prompt = summarizerPrompt(topic, subject);
    const summaryText = await generateContent(prompt);
    return new Response(JSON.stringify({ summary: summaryText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Summarizer API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate summary.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
