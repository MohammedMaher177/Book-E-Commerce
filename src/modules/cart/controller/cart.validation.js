import joi from "joi";
import { idValidation } from "../../user/controller/user.validation.js";

export const addToCartValidation = {
  body: joi
    .object({
      book: idValidation,
      qty: joi.number().positive(),
      type: joi
        .string()
        .required()
        .valid("hardcover", "pdf", "e-book", "audio")
        .insensitive(),
    })
    .required(),
};
export const createCartValidation = {
  body: joi
    .object({
      books: joi
        .array()
        .items({
          book: joi
            .object({
              _id: idValidation,
            })
            .required(),
          qty: joi.number().positive().required(),
          type: joi
            .string()
            .valid("hardcover", "pdf", "e-book", "audio")
            .required(),
        })
        .required(),
    })
    .required(),
};

export const updateCartQtyValidation = {
  body: joi
    .object({
      book: idValidation,
      qty: joi.number().positive().required(),
    })
    .required(),
};

export const removeCartItemValidation = {
  params: joi
    .object({
      id: idValidation,
      variation_name: joi.string().valid("hardcover", "pdf", "e-book", "audio"),
    })
    .required(),
};
