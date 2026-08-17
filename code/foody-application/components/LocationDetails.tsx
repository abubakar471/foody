import { LocationType } from "@/mongoose/locations/schema";

interface LocationDetailsProps{
    location: LocationType;
}

const LocationDetails = ({ location }: LocationDetailsProps) => {
    return(
        <div className="container mx-auto px-10 py-6">
            <ul className="flex flex-col gap-y-6">
                <li className="text-lg">
                    Address: {location.address ?? "N/A"}
                </li>
                <li className="text-lg">
                    ZipCode: {location.zipcode ?? "N/A"}
                </li>
                <li className="text-lg">
                    Borough: {location.borough ?? "N/A"}
                </li>
                <li className="text-lg">
                    Cuisine: {location.cuisine ?? "N/A"}
                </li>
                <li className="text-lg">
                    Grade: {location.grade ?? "N/A"}
                </li>
            </ul>
        </div>
    )
}

export default LocationDetails;
