import { DocumentDefinition } from "mongoose";
import User, { UserDocument, UserInput } from "../models/user.model";

export async function createUser(input: UserInput) {
    try {
        return await User.create(input);
    } catch (e: any) {
        throw new Error(e);
    }
}