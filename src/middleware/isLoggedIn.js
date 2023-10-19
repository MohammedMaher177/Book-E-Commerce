import UserModel from "../../DB/models/user.model.js";
import { catchError } from "../util/ErrorHandler/catchError.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = catchError(async (req, res, next) => {
    const { authorization } = req.headers;

    let reqUser = undefined
    if (authorization) {

        const decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);

        if (decoded) {
            const user = await UserModel.findById(decoded.id);
            if (user) {
                reqUser = user;
            }
        }
    }

    req.user = reqUser;

    next();
})