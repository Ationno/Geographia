const { Location } = require("../database/models");

const createLocation = async (req, res) => {
	const { address, coordinates, rating, images, details } = req.body;
	const location = await Location.create({
		userId: req.userId,
		address,
		coordinates,
		rating,
		images,
		details,
	});
	res.status(201).json(location);
};

const getAllLocations = async (req, res) => {
	const locations = await Location.findAll();
	res.json(locations);
};

const getLocationById = async (req, res) => {
	const location = await Location.findByPk(req.params.id);
	res.json(location);
};

module.exports = {
	createLocation,
	getAllLocations,
	getLocationById,
};
