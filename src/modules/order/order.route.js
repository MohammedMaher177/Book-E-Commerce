import { Router } from "express";
import express from "express";
import { validate } from "../../middleware/validate.js";
import {  checkout, successCheckOut  } from "./controller/order.controller.js";
import { allowedTo, authMiddleware } from "../../middleware/authentication.js";
import { checkoutValidation } from "./controller/order.validation.js";

const orderRouter = Router();

orderRouter.post('/',authMiddleware,validate(checkoutValidation),allowedTo('User'),checkout);

orderRouter.post('/webhook', express.raw({type: 'application/json'}),successCheckOut)
export default orderRouter;
// // orderRouter.post('/',checkOutSession);
// orderRouter.post("/cash",authMiddleware,validate(checkoutValidation),allowedTo('User'),creatCashOrder)