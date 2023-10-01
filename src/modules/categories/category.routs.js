import { Router } from "express";
import {
    addCategory,
    updateCategory,
    viewCategory,
    deletCategory,
    allCategory,
} from "./category.controller.js"


const categoryRouter = Router();

categoryRouter.get("/", allCategory);
categoryRouter.post("/addCategory", addCategory);
categoryRouter.post("/updateCategory", updateCategory);
categoryRouter.post("/deleteCategory", deletCategory);
categoryRouter.post("/:id", viewCategory);


export default categoryRouter;