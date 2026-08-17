"use client";

import {fetchLocationsActions} from "@/lib/actions/locations";
import {LocationType} from "@/mongoose/locations/schema";
import {useEffect, useRef, useState} from "react";
import LocationList from "./LocationList";

interface InfiniteLocationsProps{
    initialLocations: LocationType[];
    initialNextCursor: string | null;
    initialHasMore: boolean;
};

const InfiniteLocations = ({ initialLocations, initialNextCursor, initialHasMore }: InfiniteLocationsProps) => {
    const [locations, setLocations] = useState<LocationType[]>(initialLocations ?? []);
    const [cursor, setCursor] = useState<string | null>(initialNextCursor);
    const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(1);

    const loaderRef = useRef<HTMLDivElement | null>(null);
    
    const loadMoreLocations = async() => {
        if(loading || !hasMore || !cursor) return;

        setLoading(true);

        const res = await fetchLocationsActions(10, cursor);

        setLocations(prev => [...prev, ...res.locations]);
        setCursor(res.nextCursor);
        setHasMore(res.hasMore);
        setLoading(false);
        setCount(count+1);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];

                if(target.isIntersecting && hasMore && !loading) {
                    loadMoreLocations();
                }
            },
            { threshold: 0.5 }
        )

        if(loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [cursor, hasMore, loading]);

    return (
        <>
            <div>
                <p>Total Locations: {locations.length}</p>
                <p>fetch count: {count}</p>
            </div>

            <LocationList locations={locations} />

            {/* trigger target for infinite scroll */}
            <div ref={loaderRef} className="h-[40px] mt-10 mb-10 mx-0 text-center ">
                {loading && <p>Loading more delicious spots...</p>}
                {!hasMore && locations.length > 0 && <p>You have reached the end</p>}
            </div>
        </>
    )
}

export default InfiniteLocations;
