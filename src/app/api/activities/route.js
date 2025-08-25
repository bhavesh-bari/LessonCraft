// src/app/api/activities/route.js

import { generateContent } from "@/lib/gemini";
import { classActivityPrompt } from "@/lib/prompts";
import redisClient from '@/lib/redis';
export async function POST(req) {
  try {
    const { subject, topic, activityType } = await req.json();
    const cacheKey = `activities:${subject}:${topic}:${activityType}`;
    let cached = await redisClient.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = classActivityPrompt(topic, subject, activityType);
    let generatedText = await generateContent(prompt);
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    const activities = JSON.parse(generatedText);
    redisClient.setEx(cacheKey, 3600, JSON.stringify({ activities }));
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
