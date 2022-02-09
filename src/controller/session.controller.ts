import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import {
    createSession,
    findSession,
    updateSession,
} from "../service/session.service";
import { signJWT } from "../utils/jwt.utils";
import config from "config";

export async function createUserSessionHandler(req: Request, res: Response) {
    // validate the user's password
    const user = await validatePassword(req.body);

    if (!user) {
        return res.status(401).send("invalid email or password");
    }

    // create session
    const session = await createSession(user._id, req.get("user-agent") || "");

    const accessToken = signJWT(
        {
            ...user,
            session: session._id,
        },
        { expiresIn: config.get<string>("accessTokenTtl") }
    );

    const refreshToken = signJWT(
        {
            ...user,
            session: session._id,
        },
        { expiresIn: config.get<string>("refreshTokenTtl") }
    );

    return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
    const userID = res.locals.user._id;

    const session = await findSession({ user: userID, valid: true });

    return res.send(session);
}

export async function deleteSessionHandler(req: Request, res: Response) {
    const sessId = res.locals.user.session;

    await updateSession({ _id: sessId }, { valid: false });

    return res.send({
        accessToken: null,
        refreshToken: null,
    });
}
