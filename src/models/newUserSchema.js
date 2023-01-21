import joi from "joi";

export const newUserValidationSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required().min(10),
    password: joi.string().required().min(4)
});