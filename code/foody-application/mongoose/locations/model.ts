import mongoose, { model } from "mongoose";
import { LocationSchema, LocationType } from "@/mongoose/locations/schema";

export default mongoose.models.locations || model<LocationType>("locations", LocationSchema);
