import { UserDocument } from "./user.model";
import mongoose from "mongoose";
import config from "config";

export interface SessionDocument extends mongoose.Document {
    user: UserDocument["_id"];
    valid: boolean;
    password: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        valid: {
            type: Boolean,
            default: true,
        },
        userAgent: { type: String },
    },
    { timestamps: true }
);

const Session = mongoose.model<SessionDocument>("Session", sessionSchema);

export default Session;
