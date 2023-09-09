import jwt from "jsonwebtoken";
import Token from "../../DB/models/token.model.js";
import cloudinary from "../multer/cloudinary.js";

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
  expiredAt.setDate(expiredAt.getDate() + 7);

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