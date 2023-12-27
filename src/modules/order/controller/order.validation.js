import joi from "joi";
import { idValidation } from "../../user/controller/user.validation.js";

export const checkoutValidation = {
  body: joi
    .object({
      shippingAddress: joi
        .object().required(),
      name: joi.string(),
      paymentMethod:joi.string(),
      successCallbackURL:joi.string()
    })
    .required(),
};
