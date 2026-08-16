import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 1. Explicitly pass env vars to avoid runtime initialization crashes
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/api",
});

const graphqlLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/graphql",
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  try {
    let result;

    if (pathname.startsWith("/api/graphql")) {
      result = await graphqlLimiter.limit(`graphql_${ip}`);
    } else if (pathname.startsWith("/api/")) {
      result = await apiLimiter.limit(`api_${ip}`);
    } else {
      return NextResponse.next();
    }

    const response = result.success
      ? NextResponse.next()
      : NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );

    response.headers.set("X-RateLimit-Limit", result.limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", result.reset.toString());

    return response;
  } catch (error) {
    console.error("Rate limiter evaluation failed:", error);
    // FAIL-OPEN STRATEGY: If Redis is down, allow request through so users aren't locked out
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/api/:path*",
};


