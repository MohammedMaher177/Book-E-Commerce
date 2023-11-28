import joi from "joi";
import { idValidation } from "../../user/controller/user.validation.js";

export const checkoutValidation = {
  body: joi
    .object({
      shippingAddress: joi
        .object({
          address : joi.string(),
          city : joi.string(),
          country : joi.string(),
          phone : joi.string(),
        }).required(),
      name: joi.string(),
      paymentMethod:joi.string(),
    })
    .required(),
};
