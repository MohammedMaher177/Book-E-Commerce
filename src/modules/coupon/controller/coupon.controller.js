import Coupon from "../../../../DB/models/coupon.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";
import { getData } from "../../../util/model.util.js";

export const getCoupons = catchError(getData(Coupon));

export const createCoupon = catchError(async (req, res, next) => {
    const {code, max_use, amount} = req.body;
    const coupon = await Coupon.create({code, max_use, amount})
    res.status(201).json({message: "success", coupon});
})
// export const updateCoupon = catchError(async (req, res, next) => {
//     const {code, max_use} = req.body;
//     const coupon = await Coupon.create({code, max_use})
//     res.status(201).json({message: "success", coupon});
// })
export const deleteCoupon = catchError(async (req, res, next) => {
    const {id} = req.params;
    await Coupon.findByIdAndRemove(id)
    res.status(201).json({message: "deleted success"})
})