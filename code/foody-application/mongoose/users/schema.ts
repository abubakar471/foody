import {Schema, InferSchemaType } from "mongoose";

export const UserSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
      type: String,
      default: "",
    },
    // Array of connected OAuth providers (e.g., [{ provider: 'github', providerAccountId: '12345' }])
    accounts: [
      {
        provider: { type: String, required: true },
        providerAccountId: { type: String, required: true },
      },
    ],
}, { timestamps: true });

export type UserType = InferSchemaType<typeof UserSchema>;
