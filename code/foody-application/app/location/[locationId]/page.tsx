import LocationDetails from "@/components/LocationDetails";
import {notFound} from "next/navigation";
import { findLocationsById } from "@/mongoose/locations/services";
import Link from "next/link";
import {Metadata} from "next";

interface PageProps{
    params: Promise<{
        locationId: string;
    }>
}

/**
 * 1. Dynamic Metadata Generator
 * Generates dynamic page titles, descriptions, and Open Graph cards for links shared on Twitter, Facebook, Discord, etc.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationId } = await params;
  
  // Fetch location data (uses your Redis/MongoDB cache service)
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
      // Add siteName or images if available
      siteName: "Foody",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const LocationDetailsPage = async({params}: PageProps) => {
    const { locationId } = await params;

    const locations = await findLocationsById([locationId]); 
    const location = locations[0];

    if(!location) {
        notFound();
    }

    return(
        <main className="mt-10 container mx-auto">
            <div className="px-10 mb-6">
                <Link href="/"> {"<-"} Go Back</Link>
            </div>
            <h1 className="px-10 text-lg">Location Details of {location.location_id}</h1>
            <LocationDetails location={location} />
        </main>
    )
}

export default LocationDetailsPage;
