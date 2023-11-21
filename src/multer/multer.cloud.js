import multer from "multer";
import { AppError } from "../util/ErrorHandler/AppError.js";

export const uploadValidation = {
  image: ["image/jpeg", "image/png"],
  pdf: ["application/pdf"],
};

export const uploadImage = (customValidation) => {
  if (!customValidation) {
    customValidation = uploadValidation.image;
  }

  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("invalid file", 400), false);
    }
  };

  const upload = multer({ fileFilter, storage });

  return upload;
};
