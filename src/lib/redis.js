
import { createClient } from "redis";

let redisClient;

if (!global.redisClient) {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

  redisClient.connect()
    .then(() => console.log("✅ Connected to Redis"))
    .catch((err) => console.error("Redis connection failed:", err));

  global.redisClient = redisClient;
} else {
  redisClient = global.redisClient;
}

export default redisClient;
