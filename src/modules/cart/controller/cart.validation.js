
import joi from "joi"
import { idValidation } from "../../user/controller/user.validation.js"


export const addToCartValidation = {
    body: joi.object({
        book: joi.string().hex().length(24).required(),
        qty: joi.number().positive()
    })
}

export const updateCartQtyValidation = {
    body: joi.object({
        book: joi.string().hex().length(24).required(),
        qty: joi.number().positive().required()
    })
}

export const removeCartItemValidation = {
    params: joi.object({
        id: idValidation
    })
}