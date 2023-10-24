import { Router } from "express";
import { authMiddleware } from "../../middleware/authentication";
import checkRole from "../../middleware/roles";
import { validate } from "../../middleware/validate";
import { createCouponValidation, deleteCouponValidation } from "./controller/coupon.validation";
import { createCoupon, deleteCoupon, getCoupons } from "./controller/coupon.controller";

const couponRouter = Router();

couponRouter.route('/')
.get(authMiddleware, checkRole(['Admin']), getCoupons)
.post(authMiddleware, checkRole(['Admin']), validate(createCouponValidation), createCoupon)

couponRouter.delete('/:id', authMiddleware, checkRole(['Admin']), validate(deleteCouponValidation), deleteCoupon)