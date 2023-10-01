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


const categoryRouter = Router();

categoryRouter.get("/", allCategory);
categoryRouter.post("/addCategory", addCategory);
categoryRouter.post("/updateCategory", updateCategory);
categoryRouter.post("/deleteCategory", deletCategory);
categoryRouter.post("/:id", viewCategory);


export default categoryRouter;