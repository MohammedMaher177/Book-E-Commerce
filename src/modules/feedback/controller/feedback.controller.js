import Feedback from "../../../../DB/models/feedBack.model.js";
import { orderModel } from "../../../../DB/models/order.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";

export const checkToken = catchError(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    (err, decoded) => {
      if (err && err.name === "TokenExpiredError") {
        return next(new AppError("jwt expired", 403));
      }
      if (decoded) {
        return decoded;
      }
    }
  );
  if (!decoded) {
    return next(new AppError("access denied", 403));
  }
});

export const createFeedback = catchError(async (req, res, next) => {
  const { user } = req;
  const {
    website_rating,
    delivery_rating,
    delivery_packing_rating,
    notes,
    product_rating,
  } = req.body;
  const alreadySubmitted = await Feedback.alreadySubmittedFeedback(user._id);
  if (alreadySubmitted) {
    throw new AppError("already made a feedback", 409);
  }
  const order = await orderModel.findOne({ user: user._id });
  if (!order) {
    throw new AppError("make order first to do a feedback", 403);
  }
  const feedback = await Feedback.create({
    user_id: user._id,
    product_rating,
    website_rating,
    delivery_rating,
    delivery_packing_rating,
    notes,
  });
  res.status(201).json({ message: "success", feedback });
});
