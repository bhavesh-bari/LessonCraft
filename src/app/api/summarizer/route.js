// src/app/api/summarizer/route.js

import { generateContent } from "../../../lib/gemini";
import { summarizerPrompt } from "../../../lib/prompts";

export async function POST(req) {
  try {
    const { topic, subject } = await req.json();
    const cacheKey = `summarizer:${subject}:${topic}`;
    let cached = await redisClient.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    const prompt = summarizerPrompt(topic, subject);
    const summaryText = await generateContent(prompt);
    redisClient.setEx(cacheKey, 3600, JSON.stringify({ summary: summaryText }));
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
