import { updateWishlist } from "@/mongoose/wishlists/services";
import { GraphQLContext } from "@/app/api/graphql/route";
import { GraphQLError } from "graphql";

interface UpdateWishlistArgs {
  user_id: string;
  location_id: string;
}

export const locationMutations = {
  addWishlist: async (_: unknown, args: UpdateWishlistArgs, context: GraphQLContext) => {
    const sessionUser = context.session?.user;

    if (!sessionUser || !sessionUser.id) {
      throw new GraphQLError("Unauthorized: You must be logged in.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    if (sessionUser.id !== args.user_id) {
      throw new GraphQLError("Forbidden: You can only modify your own wishlist.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    return await updateWishlist(args.location_id, sessionUser.id, "add");
  },

  removeWishlist: async (_: unknown, args: UpdateWishlistArgs, context: GraphQLContext) => {
    const sessionUser = context.session?.user;

    if (!sessionUser || !sessionUser.id) {
      throw new GraphQLError("Unauthorized: You must be logged in.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    if (sessionUser.id !== args.user_id) {
      throw new GraphQLError("Forbidden: You can only modify your own wishlist.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    return await updateWishlist(args.location_id, sessionUser.id, "remove");
  },
};
