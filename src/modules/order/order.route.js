import { Router } from "express";
import express from "express";
import { validate } from "../../middleware/validate.js";
import {  checkout, getPdf  } from "./controller/order.controller.js";
import { allowedTo, authMiddleware } from "../../middleware/authentication.js";
import { checkoutValidation } from "./controller/order.validation.js";

const orderRouter = Router();

orderRouter.post('/',authMiddleware,validate(checkoutValidation),allowedTo('User'),checkout);
orderRouter.get('/',authMiddleware,getPdf)

export default orderRouter;
