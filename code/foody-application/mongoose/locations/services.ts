import Location from "@/mongoose/locations/model";
import Wishlist from "@/mongoose/wishlists/model";
import { LocationType } from "@/mongoose/locations/schema";
import redis from "@/lib/redis";
import { Types } from "mongoose";

// interface for cursor based pagination
export interface PaginatedLocationResponse {
    locations: LocationType[];
    nextCursor: string | null;
    hasMore: boolean;
}

/*
 * 1. Cursor based Paginated Location Fetching
 * performs fast O(1) indexed reads regardless of dataset size
*/
export const findLocations = async(limit: number, cursor?: string): Promise<PaginatedLocationResponse> => {
    try{
        // build query filter using MongoDB _id index
        const query: Record<string, any> = {};

        if(query) {
            query._id = { $gt: new Types.ObjectId(cursor) }
        }

        // fetch +1 extra record to determine if there is a next Page
        const locations = await Location.find(query)
            .sort({ _id: 1 })
            .limit(limit + 1)
            .lean();

        const hasMore = locations.length > limit;

        if(hasMore) {
            locations.pop(); // remove the 21st item from the locations array
        }

        const nextCursor = hasMore && locations.length > 0 ? (locations[locations.length - 1]._id as unknown as string).toString() : null;

        return {
            locations: locations as LocationType[],
            nextCursor,
            hasMore
        }
    } catch(err){
        console.error("Error fetching paginate locations: ", err);
        return { locations: [], nextCursor: null, hasMore: false };
    }
}

/*
 * 2. Get User Wishlist with redis caching + MongoDB aggregation pipeline
*/
export const onUserWishlist = async(user_id: string): Promise<LocationType[]> => {
    const cacheKey = `user:${user_id}:wishlist`;

    try{
        // A. Check Redis Cache First (<2ms latency)
        const cachedData = await redis.get(cacheKey);
        if(cachedData) {
            return JSON.parse(cachedData);
        }

        // B. Cache Miss -> Run single round-trip MongoDB Aggregation Pipeline
        const wishlistedLocations: LocationType[] = await Wishlist.aggregate([
            { $match: {userId: user_id } },
            {
                $lookup: {
                    from: "locations",
                    localField: "locationId",
                    foreignField: "location_id",
                    as: "locationDetails",
                }
            },
            { $unwind: "$locationDetails" },
            { $replaceRoot: { newRoot: "$locationDetails" } }
        ]);

        // C. write to redis with 1 hour expiraiton TTL (3600 seconds)
        if(wishlistedLocations.length > 0) {
            await redis.set(cacheKey, JSON.stringify(wishlistedLocations), "EX", 3600);
        }

        return wishlistedLocations;
    } catch(err) {
        console.error("error fetching user wishlist: ", err);
        return [];
    }
}

export const updateWishlist = async(location_id: string, user_id: string, action: "add" | "remove" ): Promise<boolean> => {
    const cacheKey = `user:${user_id}:wishlist`;

    try{
        if(action === "add"){
            await Wishlist.updateOne(
                { userId: user_id, locationId: location_id },
                { $setOnInsert: { userId: user_id, locationId: location_id } },
                { upsert: true }
            );
        } else if(action === "remove") {
            await Wishlist.deleteOne({userId: user_id, locationId: location_id});
        }

        // D. Invalidate Redis cache so that the next read featches the fresh data
        await redis.del(cacheKey);

        return true;
    } catch(err) {
        console.error(`error updating wishlist (${action}): `, err);
        return false;
    }
}
