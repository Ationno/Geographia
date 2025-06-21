const requireUploader = (req, res, next) => {
	if (req.role !== "uploader") {
		return res
			.status(403)
			.json({ error: "Access denied. Uploader role required." });
	}
	next();
};

module.exports = {
	requireUploader,
};
