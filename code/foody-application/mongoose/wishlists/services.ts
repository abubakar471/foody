import { LocationType } from "@/mongoose/locations/schema";
import redis from "@/lib/redis";
import Wishlist from "@/mongoose/wishlists/model";
import dbConnect from "@/middleware/db-connect";

/*
 * 1. Get User Wishlist with redis caching + MongoDB aggregation pipeline
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
        await dbConnect();
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
        await dbConnect();

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
