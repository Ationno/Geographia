const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares/auth.middleware");
const {
	getProfile,
	updateProfile,
	updatePrivacy,
	updateLocation,
	deleteUser,
	changePassword,
} = require("../controllers/user.controller");

router.get("/me", authorization, getProfile);
router.put("/me", authorization, updateProfile);
router.put("/me/privacy", authorization, updatePrivacy);
router.put("/me/location", authorization, updateLocation);
router.put("/me/password", authorization, changePassword);
router.delete("/me", authorization, deleteUser);

module.exports = router;
