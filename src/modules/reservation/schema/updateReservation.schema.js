export const updateReservationSchema = Joi.object({
  date: Joi.date(),
  status: Joi.string().valid("pendiente", "confirmada", "cancelada")
});