import { Router } from "express";
import { authMiddleware } from "../../middleware/authentication.js";
import { addCouponToCart, addToCart, getCartDetails, removeCart, removeCouponFromCart, removeItem, updateCartQty } from "./controller/cart.controller.js";
import { validate } from "../../middleware/validate.js";
import { addToCartValidation, removeCartItemValidation, updateCartQtyValidation } from "./controller/cart.validation.js";
import { isLoggedIn } from "../../middleware/isLoggedIn.js";


const cartRouter = Router()

cartRouter.route("/")
    .get(authMiddleware, getCartDetails) //Done
    .post(authMiddleware, validate(addToCartValidation), addToCart)
    .patch(authMiddleware, validate(updateCartQtyValidation), updateCartQty)
    .delete(authMiddleware, removeCart)

cartRouter.delete("/:id", authMiddleware, validate(removeCartItemValidation), removeItem)

cartRouter.put("/coupon", isLoggedIn, addCouponToCart)
cartRouter.put("/coupon/:code", isLoggedIn, removeCouponFromCart)
export default cartRouter