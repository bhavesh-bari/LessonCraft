// src/app/api/notes-generator/route.js

import { generateContent } from "@/lib/gemini";
import { notesGeneratorPrompt } from "@/lib/prompts";
import redisClient from "@/lib/redis";
import { requireAuth } from "@/lib/auth";
export async function POST(req) {
  try {
    await requireAuth();
    const { subject, topic } = await req.json();
    const cacheKey = `notes-generator:${subject}:${topic}`;
    let cached = await redisClient.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = notesGeneratorPrompt(subject, topic);
    const notesText = await generateContent(prompt);
    redisClient.setEx(cacheKey, 3600, JSON.stringify({ notes: notesText }));
    return new Response(JSON.stringify({ notes: notesText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Notes Generator API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate notes.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
