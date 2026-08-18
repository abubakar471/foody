// Unit tests verifying Auth Guard and user ownership rules in GraphQL wishlist mutations

import { locationMutations } from "@/graphql/locations/mutations";
import { GraphQLContext } from "@/app/api/graphql/route";
import { NextRequest } from "next/server";

jest.mock("@/mongoose/wishlists/services", () => ({
  updateWishlist: jest.fn().mockResolvedValue(true),
}));

describe("GraphQL Wishlist Mutations - Auth Guard", () => {
  const dummyReq = {} as NextRequest;

  it("should throw UNAUTHENTICATED error when user is not logged in", async () => {
    const unauthContext: GraphQLContext = {
      session: null,
      req: dummyReq,
    };

    const args = { location_id: "62432", user_id: "user_123" };

    await expect(
      locationMutations.addWishlist(null, args, unauthContext)
    ).rejects.toThrow("Unauthorized: You must be logged in.");
  });

  it("should throw FORBIDDEN error when session user id does not match target user_id", async () => {
    const maliciousContext: GraphQLContext = {
      session: {
        user: { id: "attacker_id", name: "Attacker" },
        expires: "2026-12-31",
      },
      req: dummyReq,
    };

    const args = { location_id: "62432", user_id: "victim_id" };

    await expect(
      locationMutations.addWishlist(null, args, maliciousContext)
    ).rejects.toThrow("Forbidden: You can only modify your own wishlist.");
  });

  it("should allow wishlist modification when session user matches target user_id", async () => {
    const validContext: GraphQLContext = {
      session: {
        user: { id: "valid_user_123", name: "Valid User" },
        expires: "2026-12-31",
      },
      req: dummyReq,
    };

    const args = { location_id: "62432", user_id: "valid_user_123" };

    const result = await locationMutations.addWishlist(null, args, validContext);
    expect(result).toBe(true);
  });
});
