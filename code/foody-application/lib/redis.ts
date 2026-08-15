import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

declare global{
    var redisClient: Redis | undefined;
}

const redis = globalThis.redisClient || new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3
});

if(process.env.NODE_ENV !== "production") {
    globalThis.redisClient = redis;
}

export default redis;
