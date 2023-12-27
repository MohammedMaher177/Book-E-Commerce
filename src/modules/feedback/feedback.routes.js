import { Router } from "express";
import { allowedTo, authMiddleware } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validate.js";
import { createFeedbackValidation } from "./controller/feedback.validation.js";
import { createFeedback } from "./controller/feedback.controller.js";

const feedbackRouter = Router();

feedbackRouter.post("/", authMiddleware, allowedTo("User"), validate(createFeedbackValidation), createFeedback);

export default feedbackRouter;
