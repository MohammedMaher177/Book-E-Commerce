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
categoryRouter.post("/addCategory", addCategory);
categoryRouter.patch("/updateCategory",uploadImage(uploadValidation.image).single("image"), updateCategory);
categoryRouter.post("/deleteCategory", deletCategory);
categoryRouter.post("/:id", viewCategory);


export default categoryRouter;