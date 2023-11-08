import joi from "joi";
import { idValidation } from "../../user/controller/user.validation.js";

export const checkoutValidation = {
  body: joi
    .object({
      shippingAdress: joi
        .object().required(),
      coupon_code: joi.string(),
      paymentMethod:joi.string(),
    })
    .required(),
};
