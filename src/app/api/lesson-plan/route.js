// /app/api/lesson-plan/route.js
import { generateContent } from "@/lib/gemini";
import { lessonPlanPrompt } from "@/lib/prompts";

export async function POST(req) {
  try {
    const { subject, topic, level } = await req.json();
    const prompt = lessonPlanPrompt(topic, subject, level);

    let generatedText = await generateContent(prompt);
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

    const lessonPlan = JSON.parse(generatedText);
    console.log("Generated Lesson Plan:", lessonPlan);
    return new Response(JSON.stringify({ lessonPlan }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Lesson Plan API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate lesson plan.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
