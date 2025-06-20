const Sequelize = require("sequelize");

const { Location } = require("../database/models");
const { Rating } = require("../database/models");
const { Tag } = require("../database/models");
const { User } = require("../database/models");
const { Comment } = require("../database/models");
const path = require("path");
const fs = require("fs");

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

const isLocationNearby = async (
	latitude,
	longitude,
	radius = 10,
	locationIdToIgnore = null
) => {
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
		if (locationIdToIgnore && loc.id === locationIdToIgnore) {
			continue;
		}
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

const deleteOldImages = async (images) => {
	if (!images) {
		return;
	}
	images.forEach((imageUrl) => {
		const oldImagePath = path.join(__dirname, "..", imageUrl);
		fs.unlink(oldImagePath, (err) => {
			if (err) {
				console.error("Error deleting an old image:", err.message);
			}
		});
	});
};

const createLocation = async (req, res) => {
	const { name, address, latitude, longitude, tags, details, type } = req.body;

	const user = await User.findByPk(req.userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const exists = await isLocationNearby(latitude, longitude);

	if (exists) {
		return res.status(409).json({ error: "Location already exists" });
	}

	if (req.files && req.files.length > 0) {
		images = req.files.map((file) => `/uploads/${file.filename}`);
	} else {
		return res.status(400).json({ error: "No images provided" });
	}

	const location = await Location.create({
		UserId: req.userId,
		name,
		address,
		latitude,
		longitude,
		details,
		type,
		images,
	});

	if (tags && tags.length > 0) {
		const tagInstances = await Promise.all(
			tags.map(async (tagName) => {
				const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
				return tag;
			})
		);

		await location.addTags(tagInstances);
	}

	const imagesURL = images.map((image) => {
		return `${req.protocol}://${req.get("host")}${image}`;
	});

	res.status(201).json({
		message: "Location created successfully",
		location: {
			id: location.id,
			name: location.name,
			address: location.address,
			latitude: location.latitude,
			longitude: location.longitude,
			images: location.images,
			details: location.details,
			tags: tags ? tags : [],
			type: location.type,
			images: imagesURL,
		},
	});
};

const updateLocation = async (req, res) => {
	const existingFields = [
		"name",
		"address",
		"latitude",
		"longitude",
		"images",
		"details",
		"tags",
		"type",
	];

	const updateFields = {};

	for (const field of existingFields) {
		if (req.body[field] !== undefined) {
			updateFields[field] = req.body[field];
		}
	}

	const user = await User.findByPk(req.userId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const location = await Location.findByPk(req.params.id);

	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	if (location.UserId !== req.userId) {
		return res
			.status(403)
			.json({ error: "You do not have permission to update this location" });
	}

	if (req.body.latitude || req.body.longitude) {
		const exists = await isLocationNearby(
			updateFields.latitude,
			updateFields.longitude,
			10,
			location.id
		);
		if (exists) {
			return res.status(409).json({ error: "Location already exists" });
		}
	}

	if (req.files && req.files.length > 0) {
		deleteOldImages(location.images);
		updateFields.images = req.files.map((file) => `/uploads/${file.filename}`);
	}

	await location.update(updateFields);
	if (updateFields.tags) {
		const tagInstances = await Promise.all(
			updateFields.tags.map(async (tagName) => {
				const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
				return tag;
			})
		);

		await location.setTags(tagInstances);
	}

	if (updateFields.images) {
		updateFields.images = updateFields.images.map((image) => {
			return `${req.protocol}://${req.get("host")}${image}`;
		});
	}

	res.status(200).json({
		message: "Location updated successfully",
		location: {
			...updateFields,
		},
	});
};

const getAllLocations = async (req, res) => {
	const locations = await Location.findAll({
		attributes: {
			include: [
				[
					Sequelize.fn(
						"COALESCE",
						Sequelize.fn("AVG", Sequelize.col("Ratings.score")),
						0
					),
					"averageRating",
				],
			],
		},
		include: [
			{
				model: Rating,
				attributes: [],
			},
			{
				model: Tag,
				attributes: ["name"],
				through: { attributes: [] },
			},
		],
		group: [
			"Location.id",
			"Tags.id",
			"Tags->location_tags.LocationId",
			"Tags->location_tags.TagId",
		],
	});
	const formattedLocations = locations.map((loc) => {
		const locJSON = loc.toJSON();

		return {
			...locJSON,
			tags: locJSON.Tags.map((tag) => tag.name),
			Tags: undefined,
		};
	});

	res.status(200).json(formattedLocations);
};

const getRuralLocations = async (req, res) => {
	const ruralLocations = await Location.findAll({
		where: { type: "rural" },
		attributes: {
			include: [
				[
					Sequelize.fn(
						"COALESCE",
						Sequelize.fn("AVG", Sequelize.col("Ratings.score")),
						0
					),
					"averageRating",
				],
			],
		},
		include: [
			{
				model: Rating,
				attributes: [],
			},
			{
				model: Tag,
				attributes: ["name"],
				through: { attributes: [] },
			},
		],
		group: [
			"Location.id",
			"Tags.id",
			"Tags->location_tags.LocationId",
			"Tags->location_tags.TagId",
		],
	});
	const formattedLocations = ruralLocations.map((loc) => {
		const locJSON = loc.toJSON();

		return {
			...locJSON,
			tags: locJSON.Tags.map((tag) => tag.name),
			Tags: undefined,
		};
	});

	res.status(200).json(formattedLocations);
};

const getGeographicLocations = async (req, res) => {
	const geographicLocations = await Location.findAll({
		where: { type: "geographic" },
		attributes: {
			include: [
				[
					Sequelize.fn(
						"COALESCE",
						Sequelize.fn("AVG", Sequelize.col("Ratings.score")),
						0
					),
					"averageRating",
				],
			],
		},
		include: [
			{
				model: Rating,
				attributes: [],
			},
			{
				model: Tag,
				attributes: ["name"],
				through: { attributes: [] },
			},
		],
		group: [
			"Location.id",
			"Tags.id",
			"Tags->location_tags.LocationId",
			"Tags->location_tags.TagId",
		],
	});
	const formattedLocations = geographicLocations.map((loc) => {
		const locJSON = loc.toJSON();

		return {
			...locJSON,
			tags: locJSON.Tags.map((tag) => tag.name),
			Tags: undefined,
		};
	});

	res.status(200).json(formattedLocations);
};

const getMyLocations = async (req, res) => {
	const user = await User.findByPk(req.userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const locations = await Location.findAll({
		attributes: {
			include: [
				[
					Sequelize.fn(
						"COALESCE",
						Sequelize.fn("AVG", Sequelize.col("Ratings.score")),
						0
					),
					"averageRating",
				],
			],
		},
		include: [
			{
				model: Rating,
				attributes: [],
			},
			{
				model: Tag,
				attributes: ["name"],
				through: { attributes: [] },
			},
		],
		group: [
			"Location.id",
			"Tags.id",
			"Tags->location_tags.LocationId",
			"Tags->location_tags.TagId",
		],
		where: { UserId: req.userId },
	});

	const formattedLocations = locations.map((loc) => {
		const locJSON = loc.toJSON();

		return {
			...locJSON,
			tags: locJSON.Tags.map((tag) => tag.name),
			Tags: undefined,
		};
	});

	res.status(200).json(formattedLocations);
};

const getLocationById = async (req, res) => {
	const location = await Location.findByPk(req.params.id, {
		attributes: {
			include: [
				[
					Sequelize.fn(
						"COALESCE",
						Sequelize.fn("AVG", Sequelize.col("Ratings.score")),
						0
					),
					"averageRating",
				],
			],
		},
		include: [
			{
				model: Rating,
				attributes: [],
			},
			{
				model: Tag,
				attributes: ["name"],
				through: { attributes: [] },
			},
		],
		group: [
			"Location.id",
			"Tags.id",
			"Tags->location_tags.LocationId",
			"Tags->location_tags.TagId",
		],
	});
	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}
	const formattedLocation = {
		...location.toJSON(),
		tags: location.Tags.map((tag) => tag.name),
		Tags: undefined,
	};

	res.json(formattedLocation);
};

const deleteLocation = async (req, res) => {
	const location = await Location.findByPk(req.params.id);
	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	if (location.UserId !== req.userId) {
		return res
			.status(403)
			.json({ error: "You do not have permission to delete this location" });
	}

	await Comment.destroy({ where: { locationId: location.id } });
	await Rating.destroy({ where: { locationId: location.id } });

	await location.setTags([]);
	await location.destroy();
	res.status(204).send();
};

const addRating = async (req, res) => {
	const { rating } = req.body;
	const location = await Location.findByPk(req.params.id);

	const user = await User.findByPk(req.userId);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	const existingRating = await Rating.findOne({
		where: {
			UserId: req.userId,
			LocationId: location.id,
		},
	});

	if (existingRating) {
		return res
			.status(400)
			.json({ error: "You have already rated this location" });
	}

	const ratingData = await Rating.create({
		UserId: req.userId,
		LocationId: location.id,
		score: rating,
	});

	res.status(201).json(ratingData);
};

const updateRating = async (req, res) => {
	const { rating } = req.body;
	const location = await Location.findByPk(req.params.id);

	const user = await User.findByPk(req.userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	if (!location) {
		return res.status(404).json({ error: "Location not found" });
	}

	const existingRating = await Rating.findOne({
		where: {
			UserId: req.userId,
			LocationId: location.id,
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
	getRuralLocations,
	getGeographicLocations,
	getLocationById,
	getMyLocations,
	deleteLocation,
	addRating,
	updateRating,
};
