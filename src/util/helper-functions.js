import jwt from "jsonwebtoken";
import Token from "../../DB/models/token.model.js";
import cloudinary from "../multer/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
export const getTokens = async (id, role) => {
  const token = jwt.sign(
    {
      id,
      role,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "2h" }
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
  return {code :n };
};
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
