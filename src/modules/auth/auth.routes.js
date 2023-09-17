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
  redirectWithToke,
  signinWithToken,
  success,
  resendEmail,
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
authRouter.get("/google", google)
authRouter.get("/google/redirect", googleRedirect, redirectWithToke)
authRouter.get("/facebook", facebook)
authRouter.get("/facebook/redirect", facebookRedirect, redirectWithToke)
authRouter.post("/signup", validate(signupValidation), signup);
authRouter.post("/signin", validate(signinValidation), signin);
authRouter.post("signin/:token", signinWithToken)
authRouter.post("/refresh", refresh);
authRouter.post("/verifyEmail", validate(verifyEmailValidation) , authMiddleware, verifyEmail);
authRouter.delete("/:id", deleteUser);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/varifyPasswordEmail",authMiddleware, varifyPasswordEmail);
authRouter.post("/resendEmail",authMiddleware, resendEmail);
authRouter.post("/resetPassword", validate(resetPasswordValidation) , authMiddleware, resetePassword);
authRouter.get("/login/success/:token", success);


export default authRouter;


// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//   })
// );

// app.get(
//   "/auth/google/redirect",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: `https://localhost:3000/login`,
//   }),
//   (req, res) => {
//     console.log(req.user);
//     res.redirect(req.user); //req.user has the redirection_url
//   }
// );