import jwt, { decode } from "jsonwebtoken";
import { catchError } from "../util/ErrorHandler/catchError.js";
import { AppError } from "../util/ErrorHandler/AppError.js";
import UserModel from "../../DB/models/user.model.js";

export const authMiddleware = catchError(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new AppError("unauthorized", 401));
  }
  const decoded = jwt.verify(authorization, process.env.TOKEN_SECRET, (err, decoded) => {
    if(err && err.name === "TokenExpiredError"){
      return next(new AppError("jwt expired", 403));
    }
    if(decoded){
      return decode;
    }
  });
  if (!decoded) {
    return next(new AppError("access denied", 403));
  }

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    return next(new AppError("access denied", 403));
  }
  
  if (user.passwordChangedAt) {
    const passwordChangedAt = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (passwordChangedAt > decoded.iat) {
      return next(new AppError("Invalid Token payload", 401));
    }
  }
  req.user = user;
  return next();
});

export const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Not Authorized", 401));
    }
    next();
  });
};
