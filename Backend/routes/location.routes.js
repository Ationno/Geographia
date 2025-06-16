const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares/auth.middleware");
const {
	createLocation,
	updateLocation,
	getAllLocations,
	getLocationById,
	getMyLocations,
	deleteLocation,
} = require("../controllers/location.controller");

const { asyncHandler } = require("../middlewares/handler.middleware");
const {
	createLocationSchema,
	updateLocationSchema,
} = require("../validators/location.validator");
const { validateRequest } = require("../middlewares/validate.middleware");

router.post(
	"/create",
	authorization,
	validateRequest(createLocationSchema),
	asyncHandler(createLocation)
);
router.put(
	"/location/:id",
	authorization,
	validateRequest(updateLocationSchema),
	asyncHandler(updateLocation)
);
router.get("/location/:id", authorization, asyncHandler(getLocationById));
router.delete("/location/:id", authorization, asyncHandler(deleteLocation));
router.get("/all", authorization, asyncHandler(getAllLocations));
router.get("/me", authorization, asyncHandler(getMyLocations));

module.exports = router;
