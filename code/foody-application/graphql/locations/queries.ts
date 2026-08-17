import { findLocations, findLocationsById } from "@/mongoose/locations/services";
import { onUserWishlist } from "@/mongoose/wishlists/services";

interface AllLocationsArgs {
  limit: number;
  cursor?: string;
}

interface LocationsByIdArgs {
  locationIds: string[];
}

interface OnUserWishlistArgs {
  user_id: string;
}

export const locationQueries = {
  allLocations: async (_: unknown, args: AllLocationsArgs) => {
    return await findLocations(args.limit, args.cursor);
  },
  locationsById: async (_: unknown, args: LocationsByIdArgs) => {
    return await findLocationsById(args.locationIds);
  },
  onUserWishlist: async (_: unknown, args: OnUserWishlistArgs) => {
    return await onUserWishlist(args.user_id);
  },
};
