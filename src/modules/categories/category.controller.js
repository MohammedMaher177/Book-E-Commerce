import { AppError } from "../../util/ErrorHandler/AppError.js";
import { catchError } from "../../util/ErrorHandler/catchError.js";
import categoryModel from "./../../../DB/models/category.model.js";




export const viewCategory = catchError(async (req,res,next)=>{
    const {categoryId}=req.body;
    
    const category = await categoryModel.findById(categoryId);
    if (!category ) {
        throw new AppError("category not found", 403);
    }
    res.json({massege:"success",category})
})
export const allCategory = catchError(async (req,res,next)=>{
    const categories = await categoryModel.find();
    res.json({massege:"success",categories})
})
export const addCategory = catchError(async (req,res,next)=>{
    const {name}=req.body;
    const existCategory = await categoryModel.findOne({name:name});
    if (existCategory ) {
        throw new AppError("category already exist", 403);
    }
    const category = await categoryModel.create(req.body)
    res.json({message: "success",category})
    
})
export const updateCategory = catchError(async (req,res,next)=>{
    const {id, name , desc}=req.body;
    const existCategory = await categoryModel.findById(id);
    if (!existCategory ) {
        throw new AppError("category not found", 403);
    }
    const category = await categoryModel.findByIdAndUpdate(
        id ,
        {name:name, desc:desc},
        {new:true}
    )
    res.json({message: "success",category})
})
export const deletCategory = catchError(async (req,res,next)=>{
    const {id}=req.body;
    
    const existCategory = await categoryModel.findById(id);
    if (!existCategory ) {
        throw new AppError("category not found", 403);
    }
    const category = await categoryModel.findByIdAndDelete(id)
    res.json({massege:"success",category})
})