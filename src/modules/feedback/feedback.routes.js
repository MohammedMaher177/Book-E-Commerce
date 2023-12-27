import { Router } from "express";
import { allowedTo, authMiddleware } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validate.js";
import { createFeedbackValidation } from "./controller/feedback.validation.js";
import {
  checkToken,
  createFeedback,
} from "./controller/feedback.controller.js";

const feedbackRouter = Router();
// feedbackRouter.get("/:token", checkToken);
feedbackRouter.post(
  "/",
  authMiddleware,
  allowedTo("User"),
  validate(createFeedbackValidation),
  createFeedback
);

export default feedbackRouter;
