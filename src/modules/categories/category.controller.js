import { ApiFeatures } from "../../util/ApiFeatures.js";
import { AppError } from "../../util/ErrorHandler/AppError.js";
import { catchError } from "../../util/ErrorHandler/catchError.js";
import { getData } from "../../util/model.util.js";
import categoryModel from "./../../../DB/models/category.model.js";

export const viewCategory = catchError(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const category = await categoryModel.findById("6501b53887c6a156d09cf0d3");
  console.log(category);
  if (!category) {
    throw new AppError("category not found", 403);
  }
  res.json({ massege: "success", category });
});

export const allCategory = catchError(getData(categoryModel));

// export const allCategory = catchError(async (req,res,next)=>{
//     const categories = await categoryModel.find();
//     res.json({massege:"success",categories})
// })

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
