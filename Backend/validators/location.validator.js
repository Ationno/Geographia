const Joi = require("joi");

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

const createLocationSchema = Joi.object({
	name: Joi.string().pattern(nameRegex).required(),
	address: Joi.string().max(255).required(),
	latitude: Joi.number().min(-90).max(90).required(),
	longitude: Joi.number().min(-180).max(180).required(),
	details: Joi.string().max(1000).optional(),
	tags: Joi.array().items(Joi.string().pattern(nameRegex)).optional(),
	type: Joi.string().valid("geographic", "rural").required(),
});

const updateLocationSchema = Joi.object({
	name: Joi.string().pattern(nameRegex).optional(),
	address: Joi.string().max(255).optional(),
	latitude: Joi.number().min(-90).max(90).optional(),
	longitude: Joi.number().min(-180).max(180).optional(),
	details: Joi.string().max(1000).optional(),
	tags: Joi.array().items(Joi.string().pattern(nameRegex)).optional(),
	type: Joi.string().valid("geographic", "rural").optional(),
}).min(1);

const ratingSchema = Joi.object({
	rating: Joi.number().min(0).max(5).required(),
});

module.exports = {
	createLocationSchema,
	updateLocationSchema,
	ratingSchema,
};
