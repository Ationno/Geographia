const Joi = require("joi");

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

const createLocationSchema = Joi.object({
	name: Joi.string().pattern(nameRegex).required(),
	latitude: Joi.number().min(-90).max(90).required(),
	longitude: Joi.number().min(-180).max(180).required(),
	images: Joi.array().items(Joi.string().uri()).required(), //check this later
	details: Joi.string().max(1000).optional(),
});

const updateLocationSchema = Joi.object({
	name: Joi.string().pattern(nameRegex).optional(),
	latitude: Joi.number().min(-90).max(90).optional(),
	longitude: Joi.number().min(-180).max(180).optional(),
	images: Joi.array().items(Joi.string().uri()).optional(), //check this later
	details: Joi.string().max(1000).optional(),
}).min(1);

const ratingSchema = Joi.object({
	score: Joi.number().integer().min(1).max(5).required(),
});

module.exports = {
	createLocationSchema,
	updateLocationSchema,
	ratingSchema,
};
