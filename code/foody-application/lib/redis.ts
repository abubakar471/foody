import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

declare global {
  var redisClient: Redis | undefined;
}

const redis =
  globalThis.redisClient ||
  new Redis(REDIS_URL, {
    // Upstash requires TLS for rediss:// URLs
    tls: REDIS_URL.startsWith("rediss://")
      ? { rejectUnauthorized: false }
      : undefined,
    // Limit retries in serverless so functions don't hang indefinitely
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy(times) {
      if (times > 1) return null; // Don't keep retrying on failure
      return 50;
    },
  });

redis.on("error", (err) => {
  console.warn("Redis Warning:", err.message);
});

if (process.env.NODE_ENV !== "production") {
  globalThis.redisClient = redis;
}

export default redis;
