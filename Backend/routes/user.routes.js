const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares/auth.middleware");
const { validateRequest } = require("../middlewares/validate.middleware");
const {
	updateProfileSchema,
	updatePrivacySchema,
	updateLocationSchema,
	updatePasswordSchema,
} = require("../validators/user.validator");
const {
	getProfile,
	getMyProfile,
	updateProfile,
	updatePrivacy,
	updateLocation,
	deleteUser,
	changePassword,
} = require("../controllers/user.controller");

const { asyncHandler } = require("../middlewares/handler.middleware");

router.get("/profile/:id", authorization, asyncHandler(getProfile));
router.get("/me", authorization, asyncHandler(getMyProfile));
router.put(
	"/me",
	authorization,
	validateRequest(updateProfileSchema),
	asyncHandler(updateProfile)
);
router.put(
	"/me/privacy",
	authorization,
	validateRequest(updatePrivacySchema),
	asyncHandler(updatePrivacy)
);
router.put(
	"/me/location",
	authorization,
	validateRequest(updateLocationSchema),
	asyncHandler(updateLocation)
);
router.put(
	"/me/password",
	authorization,
	validateRequest(updatePasswordSchema),
	asyncHandler(changePassword)
);
router.delete("/me", authorization, asyncHandler(deleteUser));

module.exports = router;
