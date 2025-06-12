const Joi = require("joi");

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

const registerSchema = Joi.object({
	first_name: Joi.string().pattern(nameRegex).required(),
	last_name: Joi.string().pattern(nameRegex).required(),
	email: Joi.string().email().required(),
	birth_date: Joi.date().iso().required(),
	password: Joi.string().min(8).pattern(/[0-9]/).required(),
});

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

module.exports = {
	registerSchema,
	loginSchema,
};
