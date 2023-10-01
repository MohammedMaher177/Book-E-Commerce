import { Router } from "express";
import {
    addCategory,
    updateCategory,
    getCategory,
    deletCategory,
    allCategory,
} from "./category.controller.js"
import { validate } from "../../middleware/validate.js";
import { addCategoryValidation, updateCategoryValidation } from "./caategory.validation.js";


const categoryRouter = Router();

categoryRouter.get("/", allCategory);
categoryRouter.get("/:id", getCategory);
categoryRouter.post("/", validate(addCategoryValidation), addCategory);

categoryRouter.patch("/:id", validate(updateCategoryValidation), updateCategory);
categoryRouter.post("/deleteCategory", deletCategory);


export default categoryRouter;