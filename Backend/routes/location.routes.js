const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares/auth.middleware");
const {
	createLocation,
	getAllLocations,
	getLocationById,
} = require("../controllers/location.controller");

router.post("/", authorization, createLocation);
router.get("/", authorization, getAllLocations);
router.get("/:id", authorization, getLocationById);

module.exports = router;
