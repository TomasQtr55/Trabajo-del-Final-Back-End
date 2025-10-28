import Joi from "joi";

export const loginUser = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),

});