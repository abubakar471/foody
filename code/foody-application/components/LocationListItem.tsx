import {LocationType} from "@/mongoose/locations/schema";
import Link from "next/link";

interface LocationListItemProps {
    location: LocationType;
};

const LocationListItem = ({location}: LocationListItemProps) => {
    return(
        <li className="my-4 bg-neutral-900 px-10 py-10 rounded-lg">
            <Link href={`/location/${location.location_id}`}>
                <h2>
                    {location.name} {" "}
                    <small className="flex items-center gap-4">
                        {location.cuisine} in ${location.borough}
                    </small>
                </h2>
            </Link>
        </li>
    );
}

export default LocationListItem;
