import Joi from "joi";

export const createPropertySchema = Joi.object({
    title: Joi.string().min(5).required(),
    description: Joi.string().max(255).optional(),
    price: Joi.number().positive().required(),
    location: Joi.string().required(),
    status: Joi.string().valid('disponible', 'reservada', 'vendida').default('disponible')
});