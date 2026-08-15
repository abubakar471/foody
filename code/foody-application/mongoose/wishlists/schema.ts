import { Schema, InferSchemaType } from  "mongoose";

export const WishlistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    locationId: {
        type: Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now()
    }
});

// Compound Index: Enforces that a user can only wishlist a location once and enables lightning-fast queries in both direction
WishlistSchema.index({userId: 1, locationId: 1}, { unique: true});

export type WishlistType = InferSchemaType<typeof WishlistSchema>;
