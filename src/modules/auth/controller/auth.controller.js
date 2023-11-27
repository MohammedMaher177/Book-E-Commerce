import { catchError } from "../../../util/ErrorHandler/catchError.js";
import UserModel from "../../../../DB/models/user.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import sendEmail from "../../../util/email/sendEmail.js";
import { emailTemp } from "../../../util/email/emailTemp.js";
import { resetRassword } from "../../../util/email/reset.password.email.js";
import bcrypt from "bcryptjs";
import Token from "../../../../DB/models/token.model.js";
import { generateCode, getTokens } from "../../../util/helper-functions.js";
import jwt from "jsonwebtoken";

export const signup = catchError(async (req, res, next) => {
  const { email } = req.body;
  const existEmail = await UserModel.findOne({ email });
  if (existEmail) {
    throw new AppError("Email Already Exist", 409);
  }
  const user = await UserModel.create(req.body);
  const { code } = generateCode();
  user.virefyCode.code = code;
  user.virefyCode.date = Date.now();
  await user.save();
  await sendEmail({
    to: email,
    subject: "Verify Your Email",
    html: emailTemp(
      "Confirm Your Email Address",
      `Thanks for signing up for Book Store E-Commerce. lets get started please enter this code
      in web site Input`,
      code
    ),
  });
  const { token } = await getTokens(user._id, user.role);
  res.status(201).json({ message: "success", token });
});

export const resendCode = catchError(async (req, res, next) => {
  const { user } = req;

  // if(user.status !== "not confirmed" && user.status !== "reseting password"){
  //   throw new AppError('this email is either confirmed or diactivated', 401);
  // }

  const { code } = generateCode();
  user.virefyCode.code = code;
  user.virefyCode.date = Date.now();
  await user.save();
  if (user.status === "not confirmed") {
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html: emailTemp(
        "Confirm Your Email Address",
        `Thanks for signing up for Book Store E-Commerce. lets get started please enter this code
        in web site Input`,
        code
      ),
    });
  }
  if (user.status === "reseting password") {
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: emailTemp(
        "Reseting Your Email Password",
        "To resete your password please enter this code in web site Input",
        code
      ),
    });
  }

  res.status(202).json({ message: "success" });
});

export const deleteUser = catchError(async (req, res, next) => {
  const { id } = req.params;
  const de = await UserModel.findByIdAndDelete(id);
  res.status(202).json(de);
});

export const signin = catchError(async (req, res, next) => {
  console.log(33333333);
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("this email doesn't exist", 404);
  }

  const isIdentical = await bcrypt.compare(password, user.password);
  if (!isIdentical) {
    throw new AppError("invalid password", 401);
  }

  const { token, refreshToken } = await getTokens(
    user._id.toString(),
    user.role
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain:
      process.env.MODE === "DEVELOPMENT" ? "" : "codecraftsportfolio.online",
  });

  res.status(201).json({ message: "success", token });
});

export const refresh = catchError(async (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];

  const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);

  if (!decoded) {
    throw new AppError("unauthenticated", 401);
  }
  const token = await Token.findOne({
    userId: decoded.id,
    token: refreshToken,
  });

  if (!(token.expiredAt >= new Date())) {
    await token.deleteOne();
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain:
        process.env.MODE === "DEVELOPMENT" ? "" : "codecraftsportfolio.online",
      maxAge: 0,
    });

    throw new AppError("reauthenticate", 403);
  }
  const newToken = jwt.sign(
    {
      id: decoded.id,
      role: decoded.role,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "2h" }
  );

  res.status(201).json({ message: "success", token: newToken });
});

export const verifyEmail = catchError(async (req, res, next) => {
  const { user } = req;
  const { code } = req.body;
  const currentDate = Date.now();
  const codeStatuse =
    currentDate - user.virefyCode.date <= 600000 ? "pass" : "expired";
  if (user.virefyCode.code !== code || codeStatuse !== "pass") {
    throw new AppError("In-Valid Verify Code", 401);
  }
  user.confirmedEmail = true;
  user.status = "active";
  user.virefyCode = {};
  await user.save();
  const { token, refreshToken } = await getTokens(
    user._id.toString(),
    user.role
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain:
      process.env.MODE === "DEVELOPMENT" ? "" : "codecraftsportfolio.online",
  });

  res.status(202).json({ message: "success", token });
});

export const forgetPassword = catchError(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("This email does not exsist", 404);
  }
  const { code } = generateCode();
  user.virefyCode.code = code;
  user.virefyCode.date = Date.now();
  user.status = "reseting password";
  await user.save();
  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    html: emailTemp(
      "Reseting Your Email Password",
      "To resete your password please enter this code in web site Input",
      code
    ),
  });
  const { token } = await getTokens(user._id.toString(), user.role);
  res.status(202).json({ message: "success", token });
});

export const varifyPasswordEmail = catchError(async (req, res, next) => {
  const { user } = req;
  const { code } = req.body;
  const currentDate = Date.now();
  const codeStatuse =
    currentDate - user.virefyCode.date <= 600000 ? "pass" : "expired";
  if (user.virefyCode.code !== code || codeStatuse !== "pass") {
    throw new AppError("In-Valid Verify Code", 403);
  }
  user.virefyCode = {};
  await user.save();
  res.status(202).json({ message: "success" });
});

export const resetePassword = catchError(async (req, res, next) => {
  const { user } = req;
  const { password } = req.body;
  user.password = password;
  user.passwordChangedAt = Date.now();
  user.status = "active"
  await user.save();
  res.status(202).json({ message: "success" });
});

export const redirectWithToken = catchError(async (req, res, next) => {
  res.redirect(req.user);
});

export const signinWithToken = catchError(async (req, res, next) => {
  const Urltoken = req.params["token"];
  const decoded = jwt.verify(Urltoken, process.env.TOKEN_SECRET);

  if (!decoded) {
    throw new AppError("Invalid token", 401);
  }
  // const payload = jwt.decode(Urltoken);
  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new AppError("This user does not exist", 404);
  }
  const { token, refreshToken } = await getTokens(
    user._id.toString(),
    user.role
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain:
      process.env.MODE === "DEVELOPMENT" ? "" : "codecraftsportfolio.online",
  });

  res.status(201).json({ message: "success", token });
});

export const logout = catchError(async (req, res, next) => {
  const { user } = req;
  const refreshToken = req.cookies["refreshToken"];
  await Token.findOneAndRemove({
    userId: user.id,
    token: refreshToken,
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain:
      process.env.MODE === "DEVELOPMENT" ? "" : "codecraftsportfolio.online",
    maxAge: 0,
  });
  res.status(201).json({ message: "success" });
});
