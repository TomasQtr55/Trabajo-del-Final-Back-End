import Joi from "joi"

export const createReservationSchema = Joi.object({
    propertyId: Joi.number().required(),
    date: Joi.date().required(),
    status: Joi.string().valid('pendiente', 'confirmada', 'cancelada').default('pendiente'),
})