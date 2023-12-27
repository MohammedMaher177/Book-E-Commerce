import Feedback from "../../../../DB/models/feedBack.model.js";
import { orderModel } from "../../../../DB/models/order.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";

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
