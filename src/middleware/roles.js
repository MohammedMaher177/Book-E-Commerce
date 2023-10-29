import { AppError } from "../util/ErrorHandler/AppError.js";
import { catchError } from "../util/ErrorHandler/catchError.js";

const checkRole = (roles) =>
  catchError(async (req, res, next) => {
    const { role } = req.user;
    !roles.includes(role)
      ? next(
          new AppError(
            "Sorry you do not have access to perform this action",
            401
          )
        )
      : next();
  });
export default checkRole;
