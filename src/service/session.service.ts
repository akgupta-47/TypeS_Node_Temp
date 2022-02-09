import config from "config";
import { SessionDocument } from "./../models/session.model";
import { FilterQuery, UpdateQuery } from "mongoose";
import Session from "../models/session.model";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
    const session = await Session.create({ user: userId, userAgent });

    return session.toJSON();
}

export async function findSession(query: FilterQuery<SessionDocument>) {
    const session = await Session.find(query).lean();

    return session;
}

export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
) {
    return Session.updateOne(query, update);
}

export async function reIssueAccessToken({
    refreshToken,
}: {
    refreshToken: string;
}) {
    const { decoded } = verifyJWT(refreshToken);

    if (!decoded || !get(decoded, "session")) return false;

    const session = await Session.findById(get(decoded, "session"));

    if (!session || !session.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = signJWT(
        {
            ...user,
            session: session._id,
        },
        { expiresIn: config.get<string>("accessTokenTtl") }
    );

    return accessToken;
}
