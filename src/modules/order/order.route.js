import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { checkOutSession } from "./controller/order.controller.js";
import { authMiddleware } from "../../middleware/authentication.js";
const orderRouter = Router();

orderRouter.get('/',authMiddleware,checkOutSession);


export default orderRouter;