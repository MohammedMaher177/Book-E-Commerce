import cloudinary from "../../multer/cloudinary.js";
import { ApiFeatures } from "../../util/ApiFeatures.js";
import { AppError } from "../../util/ErrorHandler/AppError.js";
import { catchError } from "../../util/ErrorHandler/catchError.js";
import { getData, getDocById } from "../../util/model.util.js";
import categoryModel from "./../../../DB/models/category.model.js";

export const viewCategory = catchError(getDocById(categoryModel))

export const allCategory = catchError(getData(categoryModel));

export const addCategory = catchError(async (req, res, next) => {
  const { name } = req.body;
  const existCategory = await categoryModel.findOne({ name: name });
  if (existCategory) {
    throw new AppError("category already exist", 403);
  }
  const category = await categoryModel.create(req.body);
  res.json({ message: "success", category });
});

export const updateCategory = catchError(async (req, res, next) => {
  const { id, name, desc } = req.body;
  const existCategory = await categoryModel.findById(id);
  if (!existCategory) {
    throw new AppError("category not found", 403);
  }
  const category = await categoryModel.findByIdAndUpdate(
    id,
    { name: name, desc: desc },
    { new: true }
  );
  if (req.file) {
    if (category.image.public_id) {
      const { result } = await cloudinary.uploader.destroy(
        `${category.image.public_id}`,
        (result) => {
          return result;
        }

      );
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `BookStore/category/${category._id}` }
    );

    const categoryWithImage = await categoryModel.findByIdAndUpdate(
        category._id,
      {
        image: { public_id, secure_url },
      },
      { new: true }
    );
    res.json({ message: "success", category });
  } else {
    throw new AppError("In-Valid Upload Photo", 403);
  }
 
  res.json({ message: "success", category });
});
export const deletCategory = catchError(async (req, res, next) => {
  const { id } = req.body;

  const existCategory = await categoryModel.findById(id);
  if (!existCategory) {
    throw new AppError("category not found", 403);
  }
  const category = await categoryModel.findByIdAndDelete(id);
  res.json({ massege: "success", category });
});
