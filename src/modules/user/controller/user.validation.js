import joi from "joi"

export const idValidation = joi.string().hex().length(24).required()

export const updateProfileValidations = {
    body: joi.object({
        userName: joi
            .string()
            .max(20)
            .min(4)
            .pattern(new RegExp(/^[a-zA-Z]{3,8}([_ -]?[a-zA-Z0-9]{3,8})*$/)),
        gender: joi.string().valid("Male", "Female", "Not Selected").insensitive(),
        phone: joi.string().pattern(/^(\+2)?(01)[0125][0-9]{8}$/),
        age: joi.number().min(12).max(99),
        address: joi.string(),
        city: joi.string()
    })
};

export const favoritsCatsValidations = {
    body: joi.object({
        favorits: joi.array().items(joi.object({
            id: idValidation
        })).min(1).required()
    })
}
export const wishListValidations = {
    body: joi.object({
        book: joi.string().required()
    })
}