import joi from "joi";

export const signupValidation = {
  body: joi.object({
    userName: joi.string().required().max(20).min(4).pattern(new RegExp(/^[a-zA-Z]{3,8}([_ -]?[a-zA-Z0-9]{3,8})*$/)),
    email: joi.string().email().required(),
    password: joi.string().pattern(  new RegExp(    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>]{9,}$/  ), 
    `It must contain at least one uppercase letter.
    It must contain at least one lowercase letter.
    It must contain at least one digit.
    It must contain at least one special character.
    It must be at least 9 characters long.`)
    .required(),
    rePassword: joi.string().valid(joi.ref("password")).required(),
    gender: joi.string().valid("Male", "Female", "Not Selected").insensitive(),
    phone: joi.string().pattern(/^(\+2)?(01)[0125][0-9]{8}$/),
    age: joi.number().min(12).max(99),
  }),
};

export const signinValidation = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
};
