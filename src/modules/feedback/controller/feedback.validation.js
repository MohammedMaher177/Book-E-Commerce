import joi from "joi";
import { idValidation } from "../../user/controller/user.validation.js";

export const createFeedbackValidation = {
  body: joi
    .object({
      user_id: idValidation,
      testimonial: joi.string().required(),
      website_rating: joi.number().min(1).max(10).required(),
      delivery_rating: joi.number().min(1).max(10).required(),
      delivery_packing_rating: joi.number().min(1).max(10).required(),
      notes: joi.string(),
    })
    .required(),
};
