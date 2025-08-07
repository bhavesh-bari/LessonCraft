// src/app/api/activities/route.js

import { generateContent } from "@/lib/gemini";
import { classActivityPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { subject, topic, activityType } = await req.json();
    const prompt = classActivityPrompt(topic, subject, activityType);
    let generatedText = await generateContent(prompt);

    // 3. Clean and parse the JSON response
    // The AI might wrap the JSON in markdown, so we clean it up.
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    const activities = JSON.parse(generatedText);
    return new Response(JSON.stringify({ activities }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Activities API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate activities.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
