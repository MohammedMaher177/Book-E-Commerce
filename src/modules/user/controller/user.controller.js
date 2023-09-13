import UserModel from "../../../../DB/models/user.model.js";
import cloudinary from "../../../multer/cloudinary.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";

export const getAllUsers = catchError(async (req, res, next) => {
  const users = await UserModel.find();
  res.json(users);
});
export const addProfilePhoto = catchError(async (req, res, next) => {
  const { user: __user } = req;
  if (req.file) {
    if (__user.image.public_id) {
      const { result } = await cloudinary.uploader.destroy(
        `${__user.image.public_id}`,
        (result) => {
          return result;
        }
      );
    }

    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `BookStore/User/${__user._id}` }
    );

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        image: { public_id, secure_url },
      },
      { new: true }
    );
    res.status(201).json({ message: "success", user });
  } else {
    throw new AppError("In-Valid Upload Photo", 403);
  }
});

export const updateProfile = catchError(async (req, res, next) => {
  const { userName, phone, gender, age, address, city } = req.body;
  const user = req.user;

  user.userName = userName;
  user.phone = phone;
  user.gender = gender;
  user.age = age;
  user.defultAddress = {
    address,
    city,
  }
  await user.save();

  res.status(201).json({ message: "success"});
}) 
