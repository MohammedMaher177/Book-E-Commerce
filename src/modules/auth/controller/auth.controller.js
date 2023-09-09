import { catchError } from "../../../util/ErrorHandler/catchError.js";
import UserModel from "../../../../DB/models/user.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import sendEmail from "../../../util/email/sendEmail.js";
import { emailTemp } from "../../../util/email/emailTemp.js";
import bcrypt from "bcryptjs";
import Token from "../../../../DB/models/token.model.js";
import { generateCode, getTokens } from "../../../util/helper-functions.js";
import { v4 as uuidv4 } from "uuid";

export const signup = catchError(async (req, res, next) => {
  const { email } = req.body;
  const existEmail = await UserModel.findOne({ email });
  if (existEmail) {
    throw new AppError("Email Already Exist", 403);
  }

  req.body.virefyCode = generateCode();
  const user = await UserModel.create(req.body);
  if (user) {
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: emailTemp(req.body.virefyCode),
    });
    const token = await getTokens(user._id, user.role);
    res.status(201).json({ message: "success", token });
  } else {
    throw new AppError("In-Valid Net Work", 500);
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

  res.status(201).json({ message: "success", token, refreshToken });
});

export const refresh = catchError(async (req, res) => {
  const { refreshToken } = req.body;
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

export const verifyEmail = catchError(async (req, res, nex) => {
  const { user } = req;
  const { code } = req.body;
  if (user.confirmedEmail) {
    throw new AppError("Email Already Virefied", 402);
  }

  if (code === user.virefyCode) {
    user.confirmedEmail = true;
    user.virefyCode = generateCode();
    await user.save();
    const { token, refreshToken } = await getTokens(
      user._id.toString(),
      user.role
    );
    res.status(202).json({ message: "success", token, refreshToken });
  } else {
    throw new AppError("In-Valid Verify Code", 403);
  }
});
