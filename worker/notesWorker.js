// Ensure environment variables are loaded before any modules that read them
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import redisClient from "./redis.js";
// Import Gemini client after dotenv so GEMINI_API_KEY is available at module init
const { generateContent } = await import("../src/lib/gemini.js");
import { subtopicsPrompt } from "../src/lib/prompts.js";
import { subtopicDetailsPrompt } from "../src/lib/prompts.js";

async function safeParseJSON(response) {
    try {
        return JSON.parse(response.replace(/```json|```/g, "").trim());
    } catch {
        return null;
    }
}

async function processJob(jobData) {
    const { jobId, subject, topic } = jobData;

    try {
        console.log(`⚡ Processing job: ${jobId}`);

        // Step 1: Generate subtopics
        const subtopicsResponse = await generateContent(subtopicsPrompt(subject, topic));
        const subtopics = await safeParseJSON(subtopicsResponse);
        if (!subtopics) throw new Error("Subtopics parsing failed");

        // Step 2: Generate notes
        const notes = [];
        for (const sub of subtopics) {
            const details = await generateContent(subtopicDetailsPrompt(subject, topic, sub.name));
            notes.push({ ...sub, content: details });
        }

        // Save result
        const result = { subject, topic, notes };
        await redisClient.set(`notes:status:${jobId}`, "completed", "EX", 3600);
        await redisClient.set(`notes:data:${jobId}`, JSON.stringify(result), "EX", 3600);

        console.log(`✅ Job ${jobId} completed`);
    } catch (err) {
        console.error("❌ Worker failed:", err);
        await redisClient.set(`notes:status:${jobId}`, "failed", "EX", 3600);
    }
}

async function runWorker() {
    console.log("📌 Worker started, waiting for jobs...");
    while (true) {
        try {
            const job = await redisClient.brpop("notes:queue", 0); // blocking pop
            if (job) {
                const jobData = JSON.parse(job[1]); // <-- fix here
                await processJob(jobData);
            }
        } catch (err) {
            console.error("Worker loop error:", err);
            await new Promise((r) => setTimeout(r, 5000)); // backoff
        }
    }

}

runWorker();