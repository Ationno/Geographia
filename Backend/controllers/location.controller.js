const { Location } = require("../database/models");
const { Rating } = require("../database/models");

const { Op } = require("sequelize");

const EARTH_RADIUS_METERS = 6371000;

const toRadians = (degrees) => degrees * (Math.PI / 180);

const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);
	const rLat1 = toRadians(lat1);
	const rLat2 = toRadians(lat2);

	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return EARTH_RADIUS_METERS * c;
};

const isLocationNearby = async (latitude, longitude, radius = 10) => {
	const nearbyLocations = await Location.findAll({
		where: {
			latitude: {
				[Op.between]: [latitude - 0.0001, latitude + 0.0001],
			},
			longitude: {
				[Op.between]: [longitude - 0.0001, longitude + 0.0001],
			},
		},
	});

	for (const loc of nearbyLocations) {
		const dist = getDistanceInMeters(
			latitude,
			longitude,
			loc.latitude,
			loc.longitude
		);
		if (dist <= radius) {
			return true;
		}
	}
	return false;
};

const createLocation = async (req, res) => {
	const { name, latitude, longitude, images, details } = req.body;

	const exists = await isLocationNearby(latitude, longitude);

	if (exists) {
		return res.status(409).json({ error: "Location already exists" });
	}

	const location = await Location.create({
		userId: req.userId,
		name,
		latitude,
		longitude,
		images,
		details,
	});
	res.status(201).json(location);
};

const updateLocation = async (req, res) => {
	const existingFields = ["name", "latitude", "longitude", "images", "details"];

	const updateFields = {};

	for (const field of existingFields) {
		if (req.body[field] !== undefined) {
			updateFields[field] = req.body[field];
		}
	}

	if (req.body.latitude || req.body.longitude) {
		const exists = await isLocationNearby(
			updateFields.latitude,
			updateFields.longitude
		);
		if (exists) {
			return res.status(409).json({ error: "Location already exists" });
		}
	}

	const location = await Location.findByPk(req.params.id);

	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	if (location.userId !== req.userId) {
		return res
			.status(403)
			.json({ error: "You do not have permission to update this location" });
	}

	await location.update(updateFields);

	res.status(200).json({
		message: "Location updated successfully",
		location: updateFields,
	});
};

const getAllLocations = async (req, res) => {
	const locations = await Location.findAll({
		attributes: {
			include: [
				[Sequelize.fn("AVG", Sequelize.col("Ratings.score")), "averageRating"],
			],
		},
		include: [
			{
				model: Rating,
				attributes: [],
			},
		],
		group: ["Location.id"],
	});
	res.json(locations);
};

const getMyLocations = async (req, res) => {
	const locations = await Location.findAll({
		attributes: {
			include: [
				[Sequelize.fn("AVG", Sequelize.col("Ratings.score")), "averageRating"],
			],
		},
		include: [
			{
				model: Rating,
				attributes: [],
			},
		],
		group: ["Location.id"],
		where: { userId: req.userId },
	});
	res.json(locations);
};

const getLocationById = async (req, res) => {
	const location = await Location.findByPk(req.params.id, {
		attributes: {
			include: [
				[Sequelize.fn("AVG", Sequelize.col("Ratings.score")), "averageRating"],
			],
		},
		include: [
			{
				model: Rating,
				attributes: [],
			},
		],
		group: ["Location.id"],
	});
	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}
	res.json(location);
};

const deleteLocation = async (req, res) => {
	const location = await Location.findByPk(req.params.id);
	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	if (location.userId !== req.userId) {
		return res
			.status(403)
			.json({ error: "You do not have permission to delete this location" });
	}

	// Just in case there is no onDelete cascade set up in the database
	// await Comment.destroy({ where: { locationId: location.id } });
	// await Rating.destroy({ where: { locationId: location.id } });

	await location.destroy();
	res.status(204).send();
};

const addRating = async (req, res) => {
	const { rating } = req.body;
	const location = await Location.findByPk(req.params.id);

	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	const existingRating = await Rating.findOne({
		where: {
			userId: req.userId,
			locationId: location.id,
		},
	});

	if (existingRating) {
		return res
			.status(400)
			.json({ error: "You have already rated this location" });
	}

	const ratingData = await Rating.create({
		userId: req.userId,
		locationId: location.id,
		score: rating,
	});

	res.status(201).json(ratingData);
};

const updateRating = async (req, res) => {
	const { rating } = req.body;
	const location = await Location.findByPk(req.params.id);

	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	const existingRating = await Rating.findOne({
		where: {
			userId: req.userId,
			locationId: location.id,
		},
	});

	if (!existingRating) {
		return res
			.status(404)
			.json({ error: "You have not rated this location yet" });
	}

	await existingRating.update({ score: rating });

	res.status(200).json({
		message: "Rating updated successfully",
		rating: existingRating,
	});
};

module.exports = {
	createLocation,
	updateLocation,
	getAllLocations,
	getLocationById,
	getMyLocations,
	deleteLocation,
	addRating,
	updateRating,
};
