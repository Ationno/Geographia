const { Comment } = require("../database/models");

const addComment = async (req, res) => {
	const { comment_text, location_shared, location_comment } = req.body;
	const { locationId } = req.params;
	const comment = await Comment.create({
		comment_text,
		location_shared,
		location_comment,
		userId: req.userId,
		locationId,
	});
	res.status(201).json(comment);
};

const getCommentsByLocation = async (req, res) => {
	const { locationId } = req.params;
	const comments = await Comment.findAll({ where: { locationId } });
	res.json(comments);
};

module.exports = {
	addComment,
	getCommentsByLocation,
};
