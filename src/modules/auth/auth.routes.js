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
  redirectWithToken,
  signinWithToken,
  resendCode,
  logout,
} from "./controller/auth.controller.js";
import {
  signinValidation,
  signupValidation,
  verifyEmailValidation,
  resetPasswordValidation
} from "./controller/auth.validation.js";
import { validate } from "../../middleware/validate.js";
import { authMiddleware } from "../../middleware/authentication.js";
import { facebook, facebookRedirect, google, googleRedirect } from "../../middleware/passport.js";

const authRouter = Router();

// social auth
authRouter.get("/google", google)
authRouter.get("/google/redirect", googleRedirect, redirectWithToken)
authRouter.get("/facebook", facebook)
authRouter.get("/facebook/redirect", facebookRedirect, redirectWithToken)
authRouter.post("/signin/:token", signinWithToken)

// local auth
authRouter.post("/signin", validate(signinValidation), signin);
authRouter.post("/signup", validate(signupValidation), signup);
authRouter.post("/verifyEmail", validate(verifyEmailValidation) , authMiddleware, verifyEmail);

// forget password
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/varifyPasswordEmail", authMiddleware, varifyPasswordEmail);
authRouter.post("/resetPassword", validate(resetPasswordValidation) , authMiddleware, resetePassword);

// resend code for verifying email or reset password
authRouter.post("/resendCode", resendCode);

// for geting new token using refresh token
authRouter.post("/refresh", refresh);

// log out 
authRouter.post("/logout",authMiddleware, logout);

// authRouter.delete("/:id", deleteUser);
export default authRouter;