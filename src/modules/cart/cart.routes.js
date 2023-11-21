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
  
  cartRouter
  .route("/coupon")
  .patch(authMiddleware, addCouponToCart)
  .delete("/:code", authMiddleware, removeCouponFromCart)
  // cartRouter.patch("/coupon", authMiddleware, addCouponToCart);
  // cartRouter.delete("/coupon/:code", authMiddleware, removeCouponFromCart);

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
export default cartRouter;
