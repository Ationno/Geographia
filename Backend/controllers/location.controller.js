const { Location } = require("../database/models");

const createLocation = async (req, res) => {
	const { name, latitude, longitude, rating, images, details } = req.body;

	// chequeo que exista esa locacion???

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
	const locations = await Location.findAll();
	res.json(locations);
};

const getMyLocations = async (req, res) => {
	const locations = await Location.findAll({
		where: { userId: req.userId },
	});
	res.json(locations);
};

const getLocationById = async (req, res) => {
	const location = await Location.findByPk(req.params.id);
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

	//deberia eliminar los comentarios primero

	await location.destroy();
	res.status(204).send();
};

module.exports = {
	createLocation,
	updateLocation,
	getAllLocations,
	getLocationById,
	getMyLocations,
	deleteLocation,
};
