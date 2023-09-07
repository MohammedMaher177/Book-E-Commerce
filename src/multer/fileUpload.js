import multer from "multer";
import { AppError } from "../../util/AppError.js";

export const uploadSingleFile = (fieldName, folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (req, file, cb) => {
      console.log(file);
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
      // const uniqueSuffix = file.originalname
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("please uploade images only", 401), false);
    }
  }

  const upload = multer({ storage, fileFilter });

  return upload.single(fieldName);
};

export const uploadMixOfFiles = (arrOfFields, folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
      // const uniqueSuffix = file.originalname
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("please uploade images only", 401), false);
    }
  }

  const upload = multer({ storage, fileFilter });

  return upload.fields(arrOfFields);
};
