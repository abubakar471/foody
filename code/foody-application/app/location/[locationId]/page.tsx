import LocationDetails from "@/components/LocationDetails";
import { notFound } from "next/navigation";
import { findLocationsById } from "@/mongoose/locations/services";
import { onUserWishlist } from "@/mongoose/wishlists/services";
import { auth } from "@/auth";
import Link from "next/link";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    locationId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationId } = await params;

  const locations = await findLocationsById([locationId]);
  const location = locations[0];

  if (!location) {
    return {
      title: "Location Not Found - The Food Finder",
      description: "The requested location could not be found.",
    };
  }

  const title = `Foody - Details for ${location.name}`;
  const description = `Discover ${location.name} located in ${location.borough}. Serving ${location.cuisine} cuisine at ${location.address}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Foody",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const LocationDetailsPage = async ({ params }: PageProps) => {
  const { locationId } = await params;

  const locations = await findLocationsById([locationId]);
  const rawLocation = locations[0];

  if (!rawLocation) {
    notFound();
  }

  // 1. Convert Mongoose document to plain JS object to fix Server-Client boundary error
  const location = JSON.parse(JSON.stringify(rawLocation));

  // 2. Fetch user session and verify wishlist status using onUserWishlist
  const session = await auth();
  const userId = session?.user?.id;

  let initialIsWishlisted = false;
  if (userId) {
    const userWishlist = await onUserWishlist(userId);
    initialIsWishlisted = userWishlist.some(
      (item) => item.location_id === location.location_id
    );
  }

  return (
    <main className="mt-10 container mx-auto">
      <div className="px-10 mb-6">
        <Link href="/"> {"<-"} Go Back</Link>
      </div>
      <h1 className="px-10 text-lg">Location Details of {location.location_id}</h1>
      <LocationDetails location={location} initialIsWishlisted={initialIsWishlisted} />
    </main>
  );
};

export default LocationDetailsPage;
