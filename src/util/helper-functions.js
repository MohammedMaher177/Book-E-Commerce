import { sign, verify } from "jsonwebtoken";
import Token from "../../DB/models/token.model";

export const getTokens = async (id, role) => {

    const token = sign({
        id,
        role,
    }, process.env.TOKEN_SECRET, {expiresIn: '8h'});

    const refreshToken = sign({
        id,
        role,
    }, process.env.REFRESHTOKEN_SECRET);

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);

    await Token.create({
        userId: id,
        token: refreshToken,
        expiredAt
    });

    return {  token, refreshToken };
}