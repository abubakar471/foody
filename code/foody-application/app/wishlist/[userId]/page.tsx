import {auth} from "@/auth";
import {onUserWishlist} from "@/mongoose/wishlists/services";
import { LocationType } from "@/mongoose/locations/schema";
import {Metadata} from "next";
import LocationList from "@/components/LocationList";

interface WishlistPageProps{
    params: Promise<{
        userId: string;
    }>
}

// 1. Dynamic metadata generation
export async function generateMetadata({params}: WishlistPageProps): Promise<Metadata> {
    const {userId} = await params;

    return {
        title: "Foody - Users Personal Wishlist",
        description: `A Personal Wishlist for user ${userId}`
    }
}

// 2. Main page 
export default async function WishlistPage({params}: WishlistPageProps) {
    const {userId} = await params;

    const session = await auth();

    // check ownership securely on the server
    const isCurrentUser = Boolean(session?.user?.id && session?.user?.id === userId);

    let locations: LocationType[] = [];

    try{
        const rawLocations = await onUserWishlist(userId);

        // ensure mongoose documents are plain javascript objects for React
        locations = JSON.parse(JSON.stringify(rawLocations));
    } catch(err) {
        console.error("Failed to fetch user Wishlist", err);
    }

    return(
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">    
            {isCurrentUser ? "Your " : "A "}wish list!
        </h1>

        {isCurrentUser && locations.length === 0 && (
            <div className="my-4 text-gray-600">
                <h2 className="text-xl font-semibold">Your list is currently empty! :(</h2>
                <p>Start adding locations to your wish list!</p>
            </div>
        )}

            <LocationList locations={locations} />
        </div>
    )
}
