// src/app/api/exam-generator/route.js

import { generateContent } from "@/lib/gemini";
import { examPaperPrompt } from "@/lib/prompts";
import redisClient from '@/lib/redis';
export async function POST(req) {
  try {
    const { subject, syllabus, totalMarks, duration, questions } = await req.json();
    const cacheKey = `exam-generator:${subject}:${syllabus}:${totalMarks}:${duration}:${questions}`;
    let cached = await redisClient.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = examPaperPrompt(subject, syllabus, totalMarks, duration, questions);
    let generatedText = await generateContent(prompt);
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    const paper = JSON.parse(generatedText);
    redisClient.setEx(cacheKey, 3600, JSON.stringify({ paper }));
    return new Response(JSON.stringify({ paper }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Exam Paper API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate exam paper.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
