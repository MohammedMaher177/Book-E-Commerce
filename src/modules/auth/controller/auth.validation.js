import joi from "joi";


const getCharacterValidationError = (str)=> {
  return `It must contain at least 1 ${str} character`;
};
export const signupValidation = {
  body: joi.object({
    userName: joi
      .string()
      .required()
      .max(20)
      .min(4)
      .pattern(new RegExp(/^[a-zA-Z]{3,8}([_ -]?[a-zA-Z0-9]{3,8})*$/)),
    email: joi.string().email().required(),
    password: joi
      .string()
      // 'Password should be of minimum 8 characters length'
      .min(8)
      .pattern(new RegExp(/[0-9]/), getCharacterValidationError("digit"))
      .pattern(new RegExp(/[A-Z]/), getCharacterValidationError("uppercase"))
      .pattern(new RegExp(/[a-z]/), getCharacterValidationError("lowercase"))
      .pattern(new RegExp(/[!@#$%^&*()\-_=+{};:,<.>]/), getCharacterValidationError("special caracters"))
      .required(),
    rePassword: joi.string().valid(joi.ref("password")).required(),
  }),
};

export const signinValidation = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
};

export const verifyEmailValidation = {
  body: joi.object({
    code: joi.string().length(4).required(),
  }),
};

export const resetPasswordValidation = {
  body: joi.object({
    password: joi.string().pattern(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>]{9,}$/
        ),
        `It must contain at least one uppercase letter.
    It must contain at least one lowercase letter.
    It must contain at least one digit.
    It must contain at least one special character.
    It must be at least 9 characters long.`
      ).required(),
    rePassword: joi.string().valid(joi.ref("password")).required(),
  }),
};
