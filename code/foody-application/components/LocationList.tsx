import {LocationType} from "@/mongoose/locations/schema"
import LocationListItem from "./LocationListItem";

interface LocationListProps {
    locations: LocationType[];
};

const LocationList = ({ locations }: LocationListProps) => {
    if(!locations || locations.length === 0) {
        return <p className="px-10 py-6 flex items-center text-center text-neutral-600 bg-neutral-200 border border-neutral-400">No locations found</p>
    }

    return(
        <ul className="grid grid-cols-2 gap-10">
            {
                locations.map((location) => (
                    <LocationListItem key={location.location_id} location={location} />
                ))
            }
        </ul>
    )
}

export default LocationList;
