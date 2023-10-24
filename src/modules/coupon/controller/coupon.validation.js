import joi from "joi";
import { idValidation } from "../../user/controller/user.validation";

export const createCouponValidation = {
  body: joi
    .object({
      code: joi.string().required(),
      max_use: joi.number().min(1).required(),
      amount: joi.number().required(),
    })
    .required(),
};

export const deleteCouponValidation = {
  params: joi
    .object({
      id: idValidation,
    })
    .required(),
};
