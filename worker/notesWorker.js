// worker/worker.js

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import redisClient from "./redis.js";

const publisher = redisClient.duplicate();

const { generateContent } = await import("../src/lib/gemini.js");

import { subtopicsPrompt } from "../src/lib/prompts.js";
import { subtopicDetailsPrompt } from "../src/lib/prompts.js";


async function publishStatus(jobId, status, progress, details = null) {
    const message = {
        jobId,
        status,
        progress,
        details,
    };

    await publisher.publish(`job_status:${jobId}`, JSON.stringify(message));
    console.log(`📡 Published status for ${jobId}: ${status} (${Math.round(progress * 100)}%)`);
}

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
        await publishStatus(jobId, "started", 0);
        await publishStatus(jobId, "generating_subtopics", 0.1, { message: "Creating subtopic list..." });

        const subtopicsResponse = await generateContent(subtopicsPrompt(subject, topic));
        const subtopics = await safeParseJSON(subtopicsResponse);

        if (!subtopics || !Array.isArray(subtopics)) {
            throw new Error("Subtopics parsing failed or response was not an array.");
        }

        await publishStatus(jobId, "subtopics_generated", 0.2, { subtopicCount: subtopics.length });

        const notes = [];
        for (let i = 0; i < subtopics.length; i++) {
            const sub = subtopics[i];
            const progress = 0.2 + (0.8 * (i / subtopics.length));
            await publishStatus(jobId, "generating_details", progress, { currentSubtopic: sub.name, step: i + 1, total: subtopics.length });

            const details = await generateContent(subtopicDetailsPrompt(subject, topic, sub.name));
            notes.push({ ...sub, content: details });
        }

        const result = { subject, topic, notes };

        await publishStatus(jobId, "completed", 1.0, { result });
        await redisClient.set(`notes:status:${jobId}`, "completed", "EX", 3600);
        console.log(`✅ Job ${jobId} completed`);

    } catch (err) {
        console.error("❌ Worker failed:", err);

        const currentJobId = jobId || 'unknown';

        // This line now correctly uses the globally defined 'publisher'
        await publishStatus(currentJobId, "failed", 0, { error: err.message || "An unknown error occurred." });
        await redisClient.set(`notes:status:${currentJobId}`, "failed", "EX", 3600);

    }
}


async function runWorker() {
    console.log("📌 Worker started, waiting for jobs...");

    while (true) {
        try {
            const job = await redisClient.brpop("notes:queue", 0);

            if (job) {
                const jobData = JSON.parse(job[1]);
                processJob(jobData).catch(err => console.error("Job processing failure:", err));
            }

        } catch (err) {
            console.error("Worker loop error:", err);
            await new Promise((r) => setTimeout(r, 5000));
        }
    }
}
runWorker();