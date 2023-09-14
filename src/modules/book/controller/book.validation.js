import joi from "joi";

export const bookValidation = {
  body: joi.object({
    ISBN: joi.number().required(),

    bookName: joi
      .string()
      .required()
      .pattern(new RegExp(/^[a-zA-Z]{3,8}([_ -]?[a-zA-Z0-9]{3,8})*$/)),
    lang:joi.string().required(),
    desc: joi.string().required(),
    pages: joi.number().min(10).required(),
    image:joi.required(),
    stock: joi.number(),
    price: joi.number().required(),
    discount:joi.number(),
    author:joi.string().required(),
    publisher:joi.string(),
    published:joi.string().required(),
    category:joi.required(),
    rating: joi.number().min(1).max(5),
    reviews:joi.array(),

  }),

};

