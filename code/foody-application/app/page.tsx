import InfiniteLocations from "@/components/InfiniteLocations";
import { findLocations } from "@/mongoose/locations/services";

export default async function Home() {
    // fetch initial page 1 (10 items) directly on the server
    const initialData = await findLocations(10);

    // serialize mongoose documents for client components consumption
    const serializedLocations = JSON.parse(JSON.stringify(initialData.locations));
    
    return (
        <main className="container mx-auto px-10 py-4">
            <h1>Welcome to foody</h1>

            <InfiniteLocations
                initialLocations={serializedLocations}
                initialNextCursor={initialData.nextCursor}
                initialHasMore={initialData.hasMore}
            />
        </main>
    );
}
