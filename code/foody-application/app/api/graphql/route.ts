import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { resolvers } from "@/graphql/resolvers";
import { typeDefs } from "@/graphql/schema";
import dbConnect from "@/middleware/db-connect";
import { auth } from "@/auth";
import { Session } from "next-auth";

export interface GraphQLContext {
  session: Session | null;
  req: NextRequest;
}

const server = new ApolloServer<GraphQLContext>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(server, {
  context: async (req) => {
    await dbConnect();
    const session = await auth();

    return { req, session };
  },
});

async function handleRequest(request: NextRequest) {
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

  const response = await handler(request);

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
