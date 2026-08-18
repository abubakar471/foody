"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { LocationType } from "@/mongoose/locations/schema";

interface LocationDetailsProps {
  location: LocationType;
  initialIsWishlisted?: boolean;
}

const LocationDetails = ({
  location,
  initialIsWishlisted = false,
}: LocationDetailsProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [onWishlist, setOnWishlist] = useState<boolean>(initialIsWishlisted);
  const [isPending, startTransition] = useTransition();

  const handleWishlistToggle = async () => {
    if (!userId || isPending) return;

    const previousState = onWishlist;
    const isAdding = !previousState;

    // Optimistic UI update
    setOnWishlist(isAdding);

    startTransition(async () => {
      try {
        const mutationName = isAdding ? "addWishlist" : "removeWishlist";

        // Scalar return type (Boolean) -> no sub-selection set
        const query = `
          mutation ${mutationName}($location_id: String!, $user_id: String!) {
            ${mutationName}(location_id: $location_id, user_id: $user_id)
          }
        `;

        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: {
              location_id: location.location_id,
              user_id: userId,
            },
          }),
        });

        const text = await response.text();
        const result = text ? JSON.parse(text) : null;

        if (
          !response.ok ||
          !result ||
          result.errors ||
          result.data?.[mutationName] !== true
        ) {
          console.error("GraphQL mutation error:", result?.errors ?? "Mutation failed");
          setOnWishlist(previousState);
        }
      } catch (error) {
        console.error("Error updating wishlist:", error);
        setOnWishlist(previousState);
      }
    });
  };

  return (
    <div className="container mx-auto px-10 py-6">
      <ul className="flex flex-col gap-y-4">
        <li className="text-lg">
          <span className="font-semibold">Address:</span> {location.address ?? "N/A"}
        </li>
        <li className="text-lg">
          <span className="font-semibold">ZipCode:</span> {location.zipcode ?? "N/A"}
        </li>
        <li className="text-lg">
          <span className="font-semibold">Borough:</span> {location.borough ?? "N/A"}
        </li>
        <li className="text-lg">
          <span className="font-semibold">Cuisine:</span> {location.cuisine ?? "N/A"}
        </li>
        <li className="text-lg">
          <span className="font-semibold">Grade:</span> {location.grade ?? "N/A"}
        </li>
      </ul>

      {session?.user && (
        <div className="mt-6">
          <button
            onClick={handleWishlistToggle}
            disabled={isPending}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
              onWishlist
                ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
            }`}
          >
            {isPending
              ? "Updating..."
              : onWishlist
              ? "Remove from Wishlist"
              : "Add to Wishlist"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationDetails;
