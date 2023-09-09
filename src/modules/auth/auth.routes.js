import { Router } from "express";
import {
  deleteUser,
  refresh,
  signin,
  signup,
  verifyEmail,
} from "./controller/auth.controller.js";
import {
  signinValidation,
  signupValidation,
  verifyEmailValidation,
} from "./controller/auth.validation.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authentication.js";

const authRouter = Router();

authRouter.post("/signup", validate(signupValidation), signup);
authRouter.post("/signin", validate(signinValidation), signin);
authRouter.post("/refresh", refresh);
authRouter.post("/verifyEmail", validate(verifyEmailValidation) , authMiddleware, verifyEmail);
authRouter.delete("/:id", deleteUser);

export default authRouter;
