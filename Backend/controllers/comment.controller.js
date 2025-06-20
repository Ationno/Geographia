const { Comment } = require("../database/models");
const { Location } = require("../database/models");

const addComment = async (req, res) => {
	const { comment_text, location_shared, location_comment } = req.body;
	const { locationId } = req.params;

	const location = await Location.findByPk(locationId);

	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	const comment = await Comment.create({
		comment_text,
		location_shared,
		location_comment,
		UserId: req.userId,
		LocationId: locationId,
	});

	res.status(201).json(comment);
};

const getCommentsByLocation = async (req, res) => {
	const { locationId } = req.params;

	const location = await Location.findByPk(locationId);

	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	const comments = await Comment.findAll({ where: { locationId } });

	const formattedComments = comments.map((comment) => {
		const result = { ...(comment.toJSON?.() ?? comment) };

		if (!result.location_shared) {
			delete result.location_comment;
		}

		return result;
	});

	res.json(formattedComments);
};

module.exports = {
	addComment,
	getCommentsByLocation,
};
