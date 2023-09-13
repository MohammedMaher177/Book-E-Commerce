import { Router } from "express";
import {
    addCategory,
    updateCategory,
    viewCategory,
    deletCategory,
    allCategory,
} from "./category.controller.js"


const categoryRouter = Router();

categoryRouter.get("/allcategory", allCategory);
categoryRouter.post("/viewCategory", viewCategory);
categoryRouter.post("/addCategory", addCategory);
categoryRouter.post("/updateCategory", updateCategory);
categoryRouter.post("/deleteCategory", deletCategory);


export default categoryRouter;