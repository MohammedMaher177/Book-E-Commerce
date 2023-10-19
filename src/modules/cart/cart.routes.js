import { Router } from "express";
import { authMiddleware } from "../../middleware/authentication.js";
import { addToCart, getCartDetails, removeCart, removeItem, updateCartQty } from "./controller/cart.controller.js";
import { validate } from "../../middleware/validate.js";
import { addToCartValidation, removeCartItemValidation, updateCartQtyValidation } from "./controller/cart.validation.js";


const cartRouter = Router()

cartRouter.route("/")
    .get(authMiddleware, getCartDetails) //Done
    .post(authMiddleware, validate(addToCartValidation), addToCart)
    .patch(authMiddleware, validate(updateCartQtyValidation), updateCartQty)
    .delete(authMiddleware, removeCart)

cartRouter.delete("/:id", authMiddleware, validate(removeCartItemValidation), removeItem)
export default cartRouter