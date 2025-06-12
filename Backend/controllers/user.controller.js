const { User } = require("../database/models");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
	const user = await User.findByPk(req.userId);
	res.json(user);
};

const updateProfile = async (req, res) => {
	await User.update(req.body, { where: { id: req.userId } });
	res.sendStatus(200);
};

const updatePrivacy = async (req, res) => {
	const { show_name, show_email, show_birth_date, show_location } = req.body;
	await User.update(
		{ show_name, show_email, show_birth_date, show_location },
		{ where: { id: req.userId } }
	);
	res.sendStatus(200);
};

const updateLocation = async (req, res) => {
	const { current_location } = req.body;
	await User.update({ current_location }, { where: { id: req.userId } });
	res.sendStatus(200);
};

const changePassword = async (req, res) => {
	const { newPassword } = req.body;
	const hashed = await bcrypt.hash(newPassword, 10);
	await User.update({ password: hashed }, { where: { id: req.userId } });
	res.sendStatus(200);
};

const deleteUser = async (req, res) => {
	await User.destroy({ where: { id: req.userId } });
	res.sendStatus(204);
};

module.exports = {
	getProfile,
	updateProfile,
	updatePrivacy,
	updateLocation,
	changePassword,
	deleteUser,
};
