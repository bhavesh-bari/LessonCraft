// src/app/api/notes-generator/route.js
import { generateContent } from "@/lib/gemini";
import { subtopicsPrompt, subtopicDetailsPrompt } from "@/lib/prompts";
import redisClient from "@/lib/redis";
import { requireAuth } from "@/lib/auth";

// Helper to safely parse AI JSON responses
function safeParseJSON(response) {
  // Remove markdown code fences
  let cleaned = response.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse failed after cleaning:", err, "\nResponse:", cleaned);
    return null;
  }
}

export async function POST(req) {
  try {
    await requireAuth();
    const { subject, topic } = await req.json();

    const cacheKey = `notes-generator:${subject}:${topic}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 1: Generate subtopics
    const subtopicsResponse = await generateContent(subtopicsPrompt(subject, topic));
    const subtopics = safeParseJSON(subtopicsResponse);

    if (!subtopics || !Array.isArray(subtopics)) {
      return new Response(JSON.stringify({
        error: "Failed to parse subtopics. AI response may be malformed.",
        rawResponse: subtopicsResponse
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    // Step 2: Generate detailed notes for each subtopic sequentially
    const notes = [];
    for (const subtopicObj of subtopics) {
      const { name, description } = subtopicObj;
      const details = await generateContent(subtopicDetailsPrompt(subject, topic, name));

      notes.push({
        name,
        description,
        content: details
      });
    }

    // Cache the final structured notes
    const result = { subject, topic, notes };
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Notes Generator API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate notes.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
