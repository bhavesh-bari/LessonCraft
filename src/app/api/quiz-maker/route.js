// src/app/api/quiz-maker/route.js

import { generateContent } from "@/lib/gemini";
import { quizMakerPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { subject, topic, numQuestions, questionType, difficulty } = await req.json();

    const prompt = quizMakerPrompt(subject, topic, numQuestions, questionType, difficulty);
    let generatedText = await generateContent(prompt);
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    const quiz = JSON.parse(generatedText);
    return new Response(JSON.stringify({ quiz }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Quiz Maker API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate quiz.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
