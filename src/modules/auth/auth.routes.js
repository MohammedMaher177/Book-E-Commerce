import { Router } from "express";
import {
  deleteUser,
  refresh,
  signin,
  signup,
  verifyEmail,
  forgetPassword,
  varifyPasswordEmail,
  resetePassword,
} from "./controller/auth.controller.js";
import {
  signinValidation,
  signupValidation,
  verifyEmailValidation,
  resetPasswordValidation
} from "./controller/auth.validation.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authentication.js";

const authRouter = Router();

authRouter.post("/signup", validate(signupValidation), signup);
authRouter.post("/signin", validate(signinValidation), signin);
authRouter.post("/refresh", refresh);
authRouter.post("/verifyEmail", validate(verifyEmailValidation) , authMiddleware, verifyEmail);
authRouter.delete("/:id", deleteUser);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/varifyPasswordEmail",authMiddleware, varifyPasswordEmail);
authRouter.post("/resetPassword", validate(resetPasswordValidation) , authMiddleware, resetePassword);


export default authRouter;
