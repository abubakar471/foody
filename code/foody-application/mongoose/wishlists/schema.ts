import { Schema, InferSchemaType } from "mongoose";

export const WishlistSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    locationId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

WishlistSchema.index({ userId: 1, locationId: 1 }, { unique: true });

export type WishlistType = InferSchemaType<typeof WishlistSchema>;
