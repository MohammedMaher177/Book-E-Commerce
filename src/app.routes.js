import connectionDb from "../DB/dbConnection.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import bookRouter from "./modules/book/book.routes.js";
import categoryRouter from "./modules/categories/category.routes.js";
import { AppError } from "./util/ErrorHandler/AppError.js";
import reviewRouter from "./modules/review/review.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import couponRouter from "./modules/coupon/coupon.routes.js";

export const bootstrap = (app) => {
  connectionDb();
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/book", bookRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/coupon", couponRouter);

  app.all("*", (req, res, next) => {
    next(new AppError("Page Not Found", 404));
  });

  app.use((err, req, res, next) => {
    console.log(err);
    const error = err.message;
    const code = err.statusCode || 500;
    process.env.MODE == "PRODUCTION"
      ? res.status(code).json({ message: "Error", error })
      : res.status(code).json({ message: "Error", error, stack: err.stack });
  });
};
