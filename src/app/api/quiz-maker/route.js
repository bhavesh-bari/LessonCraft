
import { generateContent } from "@/lib/gemini";
import { quizMakerPrompt } from "@/lib/prompts";
import redisClient from '@/lib/redis';
import { requireAuth } from "@/lib/auth";
export async function POST(req) {
  try {
    await requireAuth();
    const { subject, topic, numQuestions, questionType, difficulty } = await req.json();
    const cacheKey = `quiz-maker:${subject}:${topic}:${numQuestions}:${questionType}:${difficulty}`;
    let cached = await redisClient.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = quizMakerPrompt(subject, topic, numQuestions, questionType, difficulty);
    let generatedText = await generateContent(prompt);
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    const quiz = JSON.parse(generatedText);
    redisClient.setEx(cacheKey, 3600, JSON.stringify({ quiz }));
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
