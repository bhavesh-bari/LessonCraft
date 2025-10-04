// src/app/api/notes-generator/start/route.js
import redisClient from "@/lib/redis";
import { randomUUID } from "crypto";

export async function POST(req) {
    const { subject, topic } = await req.json();

    const cacheKey = `notes-generator:${subject}:${topic}`;

    const existingJobId = await redisClient.get(`${cacheKey}:jobId`);
    if (existingJobId) {

        return new Response(JSON.stringify({ jobId: existingJobId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    const jobId = randomUUID();
    const job = { jobId, subject, topic };

    await redisClient.lPush("notes:queue", JSON.stringify(job));

    await redisClient.setEx(`notes:status:${jobId}`, 86400, "pending");

    await redisClient.setEx(`${cacheKey}:jobId`, 86400, jobId);

    return new Response(JSON.stringify({ jobId }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
