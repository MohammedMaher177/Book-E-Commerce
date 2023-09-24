import { catchError } from "../../../util/ErrorHandler/catchError.js";
import UserModel from "../../../../DB/models/user.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import sendEmail from "../../../util/email/sendEmail.js";
import { emailTemp } from "../../../util/email/emailTemp.js";
import { resetRassword } from "../../../util/email/reset.password.email.js";
import bcrypt from "bcryptjs";
import Token from "../../../../DB/models/token.model.js";
import { generateCode, getTokens } from "../../../util/helper-functions.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { response } from "express";

const validationCodes = [];

export const signup = catchError(async (req, res, next) => {
  const { email } = req.body;
  const existEmail = await UserModel.findOne({ email });
  if (existEmail) {
    throw new AppError("Email Already Exist", 409);
  }
  const user = await UserModel.create(req.body);
  user.virefyCode = {};
  const { code } = generateCode();
  user.virefyCode.code = code;
  user.virefyCode.date = Date.now();
  user.save();
  console.log(user.virefyCode);
  // await sendEmail({
  //   to: email,
  //   subject: "Verify Your Email",
  //   html: emailTemp(code),
  // });
  const { token } = await getTokens(user._id, user.role);
  res.status(201).json({ message: "success", token });
});
export const resendVaryfyEmail = catchError(async (req, res, nex) => {
  const { user } = req;
  if (user) {
    user.virefyCode = {};
    const { code } = generateCode();
    user.virefyCode.code = code;
    user.virefyCode.date = Date.now();
    await user.save();
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html: emailTemp(code),
    });

    console.log(user.email);
    const { token, refreshToken } = await getTokens(
      user._id.toString(),
      user.role
    );
    res.status(202).json({ message: "success", token, refreshToken });
    // return for testing
    return;
  } else {
    throw new AppError("email not found", 403);
  }
});
export const deleteUser = catchError(async (req, res) => {
  const { id } = req.params;
  const de = await UserModel.findByIdAndDelete(id);
  res.status(202).json(de);
});

export const signin = catchError(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("this email doesn't exist", 400);
  }
  const isIdentical = await bcrypt.compare(password, user.password);
  if (!isIdentical) {
    throw new AppError("invalid email or password", 400);
  }

  const { token, refreshToken } = await getTokens(
    user._id.toString(),
    user.role
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(201).json({ message: "success", token });
});

export const refresh = catchError(async (req, res) => {
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

  if (user.confirmedEmail) {
    throw new AppError("Email Already Virefied", 402);
  }
  var codeStatuse;
  const currentDate = Date.now();
  if (currentDate - user.virefyCode.date <= 600000) {
    codeStatuse = "pass";
  } else {
    codeStatuse = "expired";
  }
  if (user.virefyCode.code === code && codeStatuse == "pass") {
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
    });

    res.status(202).json({ message: "success", token });
  } else {
    throw new AppError("In-Valid Verify Code", 401);
  }
});

export const forgetPassword = catchError(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("This email does not exsist", 404);
  }
  user.virefyCode = {};
  const { code } = generateCode();
  user.virefyCode.code = code;
  user.virefyCode.date = Date.now();
  console.log(user.virefyCode);
  user.status = "deactive";
  await user.save();

  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: resetRassword(code),
  });

  const { token } = await getTokens(user._id.toString(), user.role);
  res.status(202).json({ message: "success", token });
});

export const varifyPasswordEmail = catchError(async (req, res, next) => {
  const { user } = req;
  const { code } = req.body;
  var codeStatuse;
  const currentDate = Date.now();
  if (currentDate - user.virefyCode.date <= 600000) {
    codeStatuse = "pass";
  } else {
    codeStatuse = "expired";
  }
  if (user.virefyCode.code === code && codeStatuse == "pass") {
    user.status = "active";
    user.virefyCode = {};
    await user.save();

    res.status(202).json({ message: "success" });
  } else {
    throw new AppError("In-Valid Verify Code", 403);
  }
});

export const resetePassword = catchError(async (req, res, next) => {
  const { user } = req;
  const { password } = req.body;

  user.password = password;
  user.passwordChangedAt = Date.now();
  await user.save();
  const { token, refreshToken } = await getTokens(
    user._id.toString(),
    user.role
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(202).json({ message: "success", token });
});
export const resendResetPass = catchError(async (req, res, nex) => {
  const { user } = req;
  // const user = await UserModel.findOne({ email });
  if (user) {
    user.virefyCode = {};
    const { code } = generateCode();
    user.virefyCode.code = code;
    user.virefyCode.date = Date.now();
    user.status = "deactive";
    await user.save();
    // if (emailType == "vrify email") {
    //   await sendEmail({
    //     to: email,
    //     subject: "Verify Your Email",
    //     html: emailTemp(code),
    //   });
    // }else{
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: resetRassword(code),
    });
    // }
    console.log(code);
    const { token, refreshToken } = await getTokens(
      user._id.toString(),
      user.role
    );
    res.status(202).json({ message: "success", token, refreshToken });
  } else {
    throw new AppError("email not found", 403);
  }
});
export const redirectWithToke = catchError(async (req, res, next) => {
  console.log(req.user);
  res.redirect(req.user);
});

export const signinWithToken = catchError(async (req, res, next) => {
  const Urltoken = req.params["token"];
  const isVerifyed = jwt.verify(Urltoken, process.env.TOKEN_SECRET);
  if (!isVerifyed) {
    throw new AppError("Invalid token", 401);
  }
  const payload = jwt.decode(Urltoken);
  const user = await UserModel.findById(payload.id);
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
    domain: "http://localhost:3000",
  });

  res.status(201).json({ message: "success", token });
});

export const success = catchError(async (req, res, next) => {
  const { token } = req.params;
  console.log(token);
  res.json(token);
});
