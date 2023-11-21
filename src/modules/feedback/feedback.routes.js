import { Router } from "express";
import checkRole from "../../middleware/roles.js";
import { authMiddleware } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validate.js";
import { createFeedbackValidation } from "./controller/feedback.validation.js";
import { createFeedback } from "./controller/feedback.controller.js";

const feedbackRouter = Router();

feedbackRouter.post("/", authMiddleware, checkRole(["user"]), validate(createFeedbackValidation), createFeedback);

export default feedbackRouter;
