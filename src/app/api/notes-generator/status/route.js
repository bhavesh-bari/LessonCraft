// src/app/api/notes-generator/status/route.js
import redisClient from "@/lib/redis";
// import { requireAuth } from "@/lib/auth";

export async function GET(req) {
    // await requireAuth();
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
        return new Response(JSON.stringify({ error: "Missing jobId" }), { status: 400 });
    }

    const status = await redisClient.get(`notes:status:${jobId}`);
    const data = await redisClient.get(`notes:data:${jobId}`);

    return new Response(
        JSON.stringify({ status, data: data ? JSON.parse(data) : null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}
