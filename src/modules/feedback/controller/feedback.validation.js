import joi from "joi";
import { idValidation } from "../../user/controller/user.validation.js";

export const createFeedbackValidation = {
  body: joi
    .object({
      product_rating: joi
        .number()
        .min(1)
        .max(10)
        .required()
        .label("Invalid Product rating"),
      website_rating: joi
        .number()
        .min(1)
        .max(10)
        .required()
        .label("Invalid website rating"),
      delivery_rating: joi
        .number()
        .min(1)
        .max(10)
        .required()
        .label("Invalid delivery rating"),
      delivery_packing_rating: joi
        .number()
        .min(1)
        .max(10)
        .required()
        .label("Invalid delivery packing rating"),
      notes: joi.string().allow(null, ""),
    })
    .required(),
};
