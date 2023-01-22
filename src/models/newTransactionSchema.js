import joi from "joi";

export const newTransactionSchema = joi.object({
    type: joi.string().required().valid("entrada", "saida"),
    date: joi.string(),
    description: joi.string().required().min(3),
    value: joi.number().required(),
    user: joi.object().required(),
}); 