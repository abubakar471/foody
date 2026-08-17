"use server";

import { findLocations, PaginatedLocationResponse } from "@/mongoose/locations/services";

export const fetchLocationsActions = async(limit: number = 10, cursor?: string): Promise<PaginatedLocationResponse> => {
    try{
        const response = await findLocations(limit, cursor);

        // convert mongoose document or objectids to plain json objects for client components
        return JSON.parse(JSON.stringify(response));
    } catch(err){
        console.error(`failed to fetch locations via server actions : `, err);
        return {
            locations: [], 
            nextCursor: null,
            hasMore: false
        }
    }
}
