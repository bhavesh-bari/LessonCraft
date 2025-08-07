// src/app/api/notes-generator/route.js

import { generateContent } from "@/lib/gemini";
import { notesGeneratorPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { subject, topic } = await req.json();
    const prompt = notesGeneratorPrompt(subject, topic);
    const notesText = await generateContent(prompt);
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
