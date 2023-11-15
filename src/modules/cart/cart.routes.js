import { Router } from "express";
import { authMiddleware } from "../../middleware/authentication.js";
import {
  addCouponToCart,
  addToCart,
  creatUserCart,
  getCartDetails,
  removeCart,
  removeCouponFromCart,
  removeItem,
  updateCartQty,
} from "./controller/cart.controller.js";
import { validate } from "../../middleware/validate.js";
import {
  addToCartValidation,
  createCartValidation,
  removeCartItemValidation,
  updateCartQtyValidation,
} from "./controller/cart.validation.js";

const cartRouter = Router();

cartRouter
  .route("/")
  .get(authMiddleware, getCartDetails) //Done
  .post(authMiddleware, validate(addToCartValidation), addToCart)
  .patch(authMiddleware, validate(updateCartQtyValidation), updateCartQty)
  .delete(authMiddleware, removeCart);

cartRouter.post(
  "/createCart",
  authMiddleware,
  validate(createCartValidation),
  creatUserCart
);
cartRouter.delete(
  "/:id/:variation_name",
  authMiddleware,
  validate(removeCartItemValidation),
  removeItem
);

cartRouter.patch("/coupon", authMiddleware, addCouponToCart);
cartRouter.delete("/coupon/:code", authMiddleware, removeCouponFromCart);
export default cartRouter;
