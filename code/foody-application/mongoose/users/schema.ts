import {Schema, InferSchemaType } from "mongoose";

export const UserSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date, 
        default: Date.now()
    }
});

export type UserType = InferSchemaType<typeof UserSchema>;
