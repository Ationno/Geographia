const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares/auth.middleware");
const {
	addComment,
	getCommentsByLocation,
} = require("../controllers/comment.controller");

router.post("/:locationId", authorization, addComment);
router.get("/:locationId", authorization, getCommentsByLocation);

module.exports = router;
