import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { resolvers } from "@/graphql/resolvers";
import { typeDefs } from "@/graphql/schema";
import dbConnect from "@/middleware/db-connect";

export interface GraphQLContext {
  token: Record<string, unknown>;
  req: NextRequest;
}

const server = new ApolloServer<GraphQLContext>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(server, {
  context: async (req) => {
    // Replaces wrapper 4 (connectDB): establish/reuse DB connection per request
    await dbConnect();

    // Replaces token context logic in step 2
    const token = {}; 

    return { req, token };
  },
});

// Replaces wrapper 3 (allowCors) and method checking
async function handleRequest(request: NextRequest) {
  // 1. Handle Preflight OPTIONS requests for CORS
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // 2. Execute Apollo Server handler
  const response = await handler(request);

  // 3. Attach CORS headers to actual response
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request);
}
