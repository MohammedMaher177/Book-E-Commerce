import { ApiFeatures } from "../../util/ApiFeatures.js";
import { AppError } from "../../util/ErrorHandler/AppError.js";
import { catchError } from "../../util/ErrorHandler/catchError.js";
import { getData } from "../../util/model.util.js";
import categoryModel from "./../../../DB/models/category.model.js";

export const allCategory = catchError(getData(categoryModel));

export const getCategory = catchError(async (req, res, next) => {
  const { id } = req.params;
  const apiFeatures = new ApiFeatures(
    categoryModel.findById(id),
    req.query
  ).fields();

  
  let result = await apiFeatures.mongooseQuery;
  
  if(!result){
    throw new AppError("Category Not Found", 404)
  }
  res.json({ message: "success", result });
});

export const addCategory = catchError(async (req, res, next) => {
  const { name } = req.body;
  const existCategory = await categoryModel.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (existCategory) {
    throw new AppError("Name Already exist", 403);
  }
 
  const category = await categoryModel.create(req.body);
  res.json({ message: "success", category });
});

export const updateCategory = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const existCategory = await categoryModel.findById(id);
  if (!existCategory) {
    throw new AppError("Category Not found", 404);
  }

  const existNameCategory = await categoryModel.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });
  if (existNameCategory ) {
    throw new AppError("Name Already exist", 403);
  }

  const category = await categoryModel.findByIdAndUpdate(id, req.body, {new: true});
  
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
