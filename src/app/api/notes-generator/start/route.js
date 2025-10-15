// src/app/api/notes-generator/start/route.js
import redisClient from "@/lib/redis";
import { randomUUID } from "crypto";

export async function POST(req) {
    const { subject, topic } = await req.json();

    const cacheKey = `notes-generator:${subject}:${topic}`;

    const existingJobId = await redisClient.get(`${cacheKey}:jobId`);
    // NOTE: In a real system, you'd check the notes:status:{jobId} to ensure it's not 'failed' or 'expired'.
    if (existingJobId) {
        // Instead of returning only the ID, tell the client to check the **stream**
        return new Response(JSON.stringify({ jobId: existingJobId, streamUrl: `/api/notes-generator/stream?jobId=${existingJobId}` }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    const jobId = randomUUID();
    const job = { jobId, subject, topic };

    await redisClient.lPush("notes:queue", JSON.stringify(job));

    await redisClient.setEx(`notes:status:${jobId}`, 86400, "pending");

    await redisClient.setEx(`${cacheKey}:jobId`, 86400, jobId);

    // Return the jobId and the new stream URL
    return new Response(JSON.stringify({ jobId, streamUrl: `/api/notes-generator/stream?jobId=${jobId}` }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}