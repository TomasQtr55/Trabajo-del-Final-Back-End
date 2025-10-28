import Joi from "joi";
import dotenv from "dotenv";


dotenv.config()

const envsShema =Joi
.object({
    PORT: Joi.number().required(),
    DATABASE: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_PASS: Joi.string().allow('').optional(),
    DB_HOST: Joi.string().required(),
    JWT_SECRET: Joi.string().required()
})
.unknown(true)

const {value, error } = envsShema.validate(process.env);

if (error) throw new Error(error.message);

export const envs = {
    PORT: value.PORT,
    DATABASE: value.DATABASE,
    DB_USER: value.DB_USER,
    DB_PORT: value.DB_PORT,
    DB_PASS: value.DB_PASS,
    DB_HOST: value.DB_HOST,
    JWT_SECRET: value.JWT_SECRET
}
