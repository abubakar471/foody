import Location from "@/mongoose/locations/model";
import { LocationType } from "@/mongoose/locations/schema";
import redis from "@/lib/redis";
import { Types } from "mongoose";
import dbConnect from "@/middleware/db-connect";

const LOCATION_CACHE_TTL = 3600; // Cache TTL in seconds (e.g., 1 hour)

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
        await dbConnect();

        // build query filter using MongoDB _id index
        const query: Record<string, any> = {};

        if(cursor) {
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

/**
 * 2. Cache-Aside Multi-ID Fetching
 * Checks Redis cache first, fetches missing items from MongoDB, and backfills cache
 */
export const findLocationsById = async (
  locationIds: string[]
): Promise<LocationType[]> => {
  if (!locationIds || locationIds.length === 0) {
    return [];
  }

  try {
    const cacheKeys = locationIds.map((id) => `location:${id}`);
    const cachedData = await redis.mget(...cacheKeys);

    const foundLocations: LocationType[] = [];
    const missingIds: string[] = [];

    cachedData.forEach((item, index) => {
      if (item) {
        foundLocations.push(
          typeof item === "string" ? JSON.parse(item) : (item as LocationType)
        );
      } else {
        missingIds.push(locationIds[index]);
      }
    });

    if (missingIds.length === 0) {
      return foundLocations;
    }
    
    await dbConnect();

    const dbLocations = await Location.find({
      location_id: { $in: missingIds },
    }).lean();

    if (dbLocations.length > 0) {
      const pipeline = redis.pipeline();

      dbLocations.forEach((location) => {
        pipeline.setex(
          `location:${location.location_id}`,
          LOCATION_CACHE_TTL,
          JSON.stringify(location)
        );
      });

      await pipeline.exec();
    }

    return [...foundLocations, ...(dbLocations as LocationType[])];
  } catch (err) {
    console.error("Error in findLocationsById service:", err);
    // Fallback directly to MongoDB if Redis throws an exception
    await dbConnect();

    return (await Location.find({
      location_id: { $in: locationIds },
    }).lean()) as LocationType[];
  }
};
