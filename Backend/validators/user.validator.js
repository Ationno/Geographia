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

const updateProfileSchema = Joi.object({
	first_name: Joi.string().pattern(nameRegex).optional(),
	last_name: Joi.string().pattern(nameRegex).optional(),
	email: Joi.string().email().optional(),
	birth_date: Joi.date().iso().optional(),
	profile_image_url: Joi.string().uri().optional(),
}).min(1);

const updatePrivacySchema = Joi.object({
	show_name: Joi.boolean().optional(),
	show_email: Joi.boolean().optional(),
	show_birth_date: Joi.boolean().optional(),
	show_location: Joi.boolean().optional(),
}).min(1);

const updateLocationSchema = Joi.object({
	latitude: Joi.number().min(-90).max(90).required(),
	longitude: Joi.number().min(-180).max(180).required(),
});

const updatePasswordSchema = Joi.object({
	new_password: Joi.string().min(8).pattern(/[0-9]/).required(),
	confirm_new_password: Joi.string().valid(Joi.ref("new_password")).required(),
}).with("new_password", "confirm_new_password");

module.exports = {
	registerSchema,
	loginSchema,
	updateProfileSchema,
	updatePrivacySchema,
	updateLocationSchema,
	updatePasswordSchema,
};
