import mongoose, { model } from "mongoose";
import { WishlistSchema, WishlistType } from "@/mongoose/wishlists/schema";

export default mongoose.models.wishlists || model<WishlistType>("wishlists", WishlistSchema);
