const requireUploader = (req, res, next) => {
	console.log(req.role);
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
