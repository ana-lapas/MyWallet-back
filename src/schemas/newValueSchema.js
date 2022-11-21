import joi from "joi"

export const newTransactionSchema = joi.object({
    description: joi.string().required().min(3),
    cost: joi.number().required()
})