import { Router } from "express";
import checkRole from "../../middleware/roles";
import { authMiddleware } from "../../middleware/authentication";
import { validate } from "../../middleware/validate";
import { createFeedbackValidation } from "./controller/feedback.validation";
import { createFeedback } from "./controller/feedback.controller";

const feedbackRouter = Router();

feedbackRouter.post("/", authMiddleware, checkRole(["user"]), validate(createFeedbackValidation), createFeedback);

export default feedbackRouter;
