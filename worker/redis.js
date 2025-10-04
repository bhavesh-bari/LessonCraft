
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import Redis from "ioredis";
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error("❌ REDIS_URL is not defined in your environment variables");
}


const redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
});

redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err) => console.error("❌ Redis error:", err));

export default redisClient;
