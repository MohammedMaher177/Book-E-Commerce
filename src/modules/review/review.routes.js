

import { Router } from "express";
import { UpdateReview, addReview, deleteReview, getAllReviews, getReview } from "./controller/review.controller.js";
import { allowedTo, authMiddleware } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validate.js";
import { addReviewValidation, updateReviewValidation } from "./controller/review.validation.js";

const reviewRouter = Router();

/**Get All Categories && Add */
reviewRouter.route("/")
    .get(getAllReviews)
    .post(authMiddleware, validate(addReviewValidation), allowedTo("User"), addReview)

/**Update && delete brand */
reviewRouter.route("/:id")
    .get(getReview)
    .put(authMiddleware, allowedTo("User"), validate(updateReviewValidation) , UpdateReview)
    .delete(authMiddleware, allowedTo("Admin", "User"), deleteReview)


export default reviewRouter;

