import { Router } from "express";
// import { authMiddleware } from "../../middleware/authentication";
import checkRole from "../../middleware/roles.js";
import { validate } from "../../middleware/validate.js";
import { createCouponValidation, deleteCouponValidation } from "./controller/coupon.validation.js";
import { createCoupon, deleteCoupon, getCoupons } from "./controller/coupon.controller.js";
import { authMiddleware } from "../../middleware/authentication.js";

const couponRouter = Router();

couponRouter.route('/')
.get(authMiddleware, checkRole(['Admin']), getCoupons)
.post(authMiddleware, checkRole(['Admin']), validate(createCouponValidation), createCoupon)

couponRouter.delete('/:id', authMiddleware, checkRole(['Admin']), validate(deleteCouponValidation), deleteCoupon)


export default couponRouter;