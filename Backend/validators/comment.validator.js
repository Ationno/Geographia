const Joi = require("joi");

const createCommentSchema = Joi.object({
	comment_text: Joi.string().min(1).max(500).required(),
	location_shared: Joi.boolean().default(false),
	location_comment: Joi.string().max(500).required(),
});

module.exports = {
	createCommentSchema,
};
