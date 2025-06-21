const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares/auth.middleware");
const {
	createLocation,
	updateLocation,
	getAllLocations,
	getRuralLocations,
	getGeographicLocations,
	getLocationById,
	getMyLocations,
	deleteLocation,
	addRating,
	updateRating,
} = require("../controllers/location.controller");

const { asyncHandler } = require("../middlewares/handler.middleware");
const {
	createLocationSchema,
	updateLocationSchema,
	ratingSchema,
} = require("../validators/location.validator");
const { validateRequest } = require("../middlewares/validate.middleware");

const { requireUploader } = require("../middlewares/role.middleware");

const upload = require("../middlewares/upload.middleware");

router.post(
	"/create",
	authorization,
	requireUploader,
	upload.array("images", 20),
	validateRequest(createLocationSchema),
	asyncHandler(createLocation)
);
router.put(
	"/location/:id",
	authorization,
	requireUploader,
	upload.array("images", 20),
	validateRequest(updateLocationSchema),
	asyncHandler(updateLocation)
);
router.get("/location/:id", authorization, asyncHandler(getLocationById));
router.delete(
	"/location/:id",
	authorization,
	requireUploader,
	asyncHandler(deleteLocation)
);
router.get("/all", authorization, asyncHandler(getAllLocations));
router.get("/me", authorization, asyncHandler(getMyLocations));
router.post(
	"/location/:id/rate",
	authorization,
	validateRequest(ratingSchema),
	asyncHandler(addRating)
);
router.put(
	"/location/:id/rate",
	authorization,
	validateRequest(ratingSchema),
	asyncHandler(updateRating)
);
router.get("/rural/", authorization, asyncHandler(getRuralLocations));
router.get("/geographic/", authorization, asyncHandler(getGeographicLocations));

module.exports = router;
