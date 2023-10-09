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
import { isLoggedIn } from "../../middleware/isLoggedIn.js";


const categoryRouter = Router();

categoryRouter.get("/", allCategory);
categoryRouter.get("/:id", isLoggedIn, viewCategory);
categoryRouter.post("/", addCategory);
categoryRouter.patch("/", uploadImage(uploadValidation.image).single("image"), updateCategory);
categoryRouter.delete("/", deletCategory);


export default categoryRouter;