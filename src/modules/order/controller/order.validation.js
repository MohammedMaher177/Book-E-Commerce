import joi from "joi";
import { idValidation } from "../../user/controller/user.validation.js";

export const checkoutValidation = {
  body: joi
    .object({
      shippingAddress: joi
        .object({
          address: joi.string().required(),
          city: joi.string().required(),
          country: joi.string().required(),
          phone: joi.string().required(),
        })
        .required(),
      name: joi.string(),
      paymentMethod: joi.string(),
      successCallbackURL: joi.string(),
    })
    .required(),
};
