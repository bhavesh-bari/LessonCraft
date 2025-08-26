// /app/api/lesson-plan/route.js
import { generateContent } from "@/lib/gemini";
import { lessonPlanPrompt } from "@/lib/prompts";
import redisClient from "@/lib/redis";
import { requireAuth } from "@/lib/auth";
export async function POST(req) {
  try {
    await requireAuth();
    const { subject, topic, level } = await req.json();

    const cacheKey = `lesson-plan:${subject}:${topic}:${level}`;

    let cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("⚡ Serving from Redis cache");
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    const prompt = lessonPlanPrompt(topic, subject, level);
    let generatedText = await generateContent(prompt);

    generatedText = generatedText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const lessonPlan = JSON.parse(generatedText);

    const responseData = JSON.stringify({ lessonPlan });

    await redisClient.setEx(cacheKey, 3600, responseData);

    return new Response(responseData, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Lesson Plan API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate lesson plan.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
