import { Router } from "express";
import express from "express";
import { validate } from "../../middleware/validate.js";
import {  checkout, getPdf, sendFeadbackEmail  } from "./controller/order.controller.js";
import { allowedTo, authMiddleware } from "../../middleware/authentication.js";
import { checkoutValidation } from "./controller/order.validation.js";

const orderRouter = Router();

orderRouter.post('/',authMiddleware,validate(checkoutValidation),allowedTo('User'),checkout);
orderRouter.get('/',authMiddleware,getPdf)
orderRouter.get('/feedback/:email',sendFeadbackEmail)

export default orderRouter;
