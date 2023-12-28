import { Router } from "express";
import { allowedTo, authMiddleware } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validate.js";
import { createFeedbackValidation } from "./controller/feedback.validation.js";
import {
  checkToken,
  checkuser,
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
feedbackRouter.get("/checkuser", authMiddleware, checkuser);
export default feedbackRouter;
