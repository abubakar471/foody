import { updateWishlist } from "@/mongoose/wishlists/services";
import { GraphQLContext } from "@/app/api/graphql/route";

interface UpdateWishlistArgs {
  user_id: string;
  location_id: string;
}

export const locationMutations = {
  addWishlist: async (_: unknown, args: UpdateWishlistArgs, _context: GraphQLContext) => {
    return await updateWishlist(args.location_id, args.user_id, "add");
  },
  removeWishlist: async (_: unknown, args: UpdateWishlistArgs, _context: GraphQLContext) => {
    return await updateWishlist(args.location_id, args.user_id, "remove");
  },
};
