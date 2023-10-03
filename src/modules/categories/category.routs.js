import { Router } from "express";
import {
    addCategory,
    updateCategory,
    // getCategory,
    deletCategory,
    allCategory,
    viewCategory,
} from "./category.controller.js"
import { validate } from "../../middleware/validate.js";
import { addCategoryValidation, updateCategoryValidation } from "./caategory.validation.js";
import { uploadImage, uploadValidation } from "../../multer/multer.cloud.js";


const categoryRouter = Router();

categoryRouter.get("/", allCategory);
categoryRouter.post("/", addCategory);
categoryRouter.post("/:id", viewCategory);
categoryRouter.patch("/",uploadImage(uploadValidation.image).single("image"), updateCategory);
categoryRouter.delete("/", deletCategory);


export default categoryRouter;