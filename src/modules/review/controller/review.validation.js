import joi from "joi"

const idValidation = joi.string().hex().length(24).required()

export const addReviewValidation = {
    body: joi.object({
        content: joi.string().min(3).required(),
        rating: joi.number().required().min(1).max(5),
        book: idValidation
    }).required()
}

export const updateReviewValidation = {
    body: joi.object({
        content: joi.string().min(3).max(50),
        rating: joi.number().min(1).max(5),
    }),
    params:
        joi.object({
            id: idValidation
        })
}

export const deleteBrandValidation = {
    params: joi.object({
        id: idValidation
    })
}
