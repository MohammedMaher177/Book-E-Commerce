import mongoose from "mongoose";
import bookModel from "../../../../DB/models/book.model.js";
import UserModel from "../../../../DB/models/user.model.js";
import cloudinary from "../../../multer/cloudinary.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";
import { bookByCategory } from "../../book/controller/book.controller.js";

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
  };
  await user.save();

  res.status(201).json({ message: "success" });
});

export const profile = catchError(async (req, res, next) => {
  const user = req.user;

  const returnUser = {
    userName: user.userName,
    gender: user.gender,
    phone: user.phone,
    address: user.defultAddress.address,
    city: user.defultAddress.city,
    age: user.age,
    fav_cats: await user.fav_cats,
    wish_List:await user.whish_list,
  };
  res.status(200).json({ message: "success", user: returnUser });
});

export const addToFavCat = catchError(async (req, res, next) => {
  const { user } = req;
  const { favorits } = req.body;
  user.fav_cats = favorits.map((el) => el.id);
  await user.save();
  res.status(201).json({ message: "success" });
});

export const addWhishList = catchError(async (req, res, next) => {
  const { user } = req;
  const { book } = req.body;
  // let _user;
  if (user.whish_list.includes(book)) {
    console.log(user.whish_list);
    const index= user.whish_list.indexOf(book)
    user.whish_list.splice(index, 1);
    await user.save();
    console.log(user.whish_list);
    return res.status(202).json({ message: "success", wish_List:user.whish_list });
  }
   user.whish_list.push(book);
  await user.save();
  return res.status(201).json({ message: "success", wish_List:user.whish_list });

  // if (user.whish_list.includes(wishBook)) {
  //   _user = await UserModel.findByIdAndUpdate(user._id, {
  //     $pull:{
  //       whish_list: wishBook
  //     }
  //   }, {new: true})
  // }
  // else {
  //   _user = await UserModel.findByIdAndUpdate(user._id, {
  //     $push:{
  //       whish_list: wishBook
  //     }
  //   }, {new: true})
  // }

});
