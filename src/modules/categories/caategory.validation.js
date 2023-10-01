import joi from "joi";

export const addCategoryValidation = {
  body: joi.object({
    name: joi.string().required(),
    desc: joi.string().required(),
  }),
};

export const updateCategoryValidation = {
  body: joi.object({
    name: joi.string(),
    desc: joi.string(),
  }),
};
