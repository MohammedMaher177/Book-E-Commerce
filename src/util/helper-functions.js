import jwt from "jsonwebtoken";
import Token from "../../DB/models/token.model.js";
import cloudinary from "../multer/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import bookModel from "../../DB/models/book.model.js";
import reviewModel from "../../DB/models/review.model.js";
import { feedbackEmail } from "./email/feedback.mail.js";
import UserModel from "../../DB/models/user.model.js";
import { AppError } from "./ErrorHandler/AppError.js";
import sendEmail from "./email/sendEmail.js";
export const createToken = async (id, role) => {
  const token = jwt.sign(
    {
      id,
      role,
    },
    process.env.TOKEN_SECRET
  );

  return token;
};
export const getTokens = async (id, role, expiresIn = "2h") => {
  const token = jwt.sign(
    {
      id,
      role,
    },
    process.env.TOKEN_SECRET,
    { expiresIn }
  );

  const refreshToken = jwt.sign(
    {
      id,
      role,
    },
    process.env.REFRESHTOKEN_SECRET
  );

  const expiredAt = new Date();
  // expiredAt.setDate(expiredAt.getDate() + 7);
  expiredAt.setHours(expiredAt.getHours() + 2);

  await Token.create({
    userId: id,
    token: refreshToken,
    expiredAt,
  });

  return { token, refreshToken };
};

export const deleteImg = (model) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const { public_id } = req.body;
    const { result } = await cloudinary.uploader.destroy(
      `${public_id}`,
      (result) => {
        return result;
      }
    );
    if (result === "ok") {
      await model.findByIdAndUpdate(id, { logo: null });
      return res.json({ message: "success", param: "Image Deleted" });
    } else if (result === "not found") {
      return next(new AppError("In-Valid public_id", 404));
    }
  };
};

export const generateCode = () => {
  let n = uuidv4();
  n = n.split("-")[0].substring(0, 4);
  return { code: n };
};
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const suggestCategory = async (categories) => {
  let result = [],
    i = 0;
  for (const category of categories) {
    const cat = await bookModel.find({ category }).limit(5);
    result = result.concat(cat);
  }
  return result;
};
export const getRating = async (book) => {
  let reviews = await reviewModel.find({ book: book });
  var avg;
  if (!reviews) {
    avg = 0;
    return avg;
  }
  reviews = reviews.map((el) => el.rating);
  var total = 0;
  for (var i = 0; i < reviews.length; i++) {
    total += reviews[i];
  }
  avg = total / reviews.length;
  return avg;
};
export const sendFeedbackEmail = async (email) => {
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new AppError("Email not found", 404);
  }
  const { token } = await getTokens(user._id, user.role, "7d");
  const url = `${process.env.BASE_URL}feedback/${token}`;
  await sendEmail({
    to: email,
    subject: "Feedback Email",
    text: "Feedback Email",
    html: feedbackEmail(
      "Feedback Email",
      `Thanks for using Book Store E-Commerce. Let us know your feedback`,
      url
    ),
  });
};
