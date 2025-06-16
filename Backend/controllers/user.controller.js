const { User } = require("../database/models");
const { Comment } = require("../database/models");
const { Rating } = require("../database/models");
const { Location } = require("../database/models");
const bcrypt = require("bcrypt");

const getMyProfile = async (req, res) => {
	const user = await User.findByPk(req.userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const { password, ...userWithoutPassword } = user.toJSON();
	res.json(userWithoutPassword);
};

const getProfile = async (req, res) => {
	const user = await User.findByPk(req.params.id);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const { password, ...userWithoutPassword } = user.toJSON();
	res.json(userWithoutPassword);
};

const updateProfile = async (req, res) => {
	const existingFields = [
		"first_name",
		"last_name",
		"email",
		"birth_date",
		"profile_image_url",
	];

	const updateFields = {};

	for (const field of existingFields) {
		if (req.body[field] !== undefined) {
			updateFields[field] = req.body[field];
		}
	}

	if (req.body.email) {
		const existingUser = await User.findOne({
			where: { email: req.body.email },
		});
		if (existingUser && existingUser.id !== req.userId) {
			return res.status(400).json({ error: "Email already in use" });
		}
	}

	const user = await User.update(updateFields, { where: { id: req.userId } });

	if (!user[0]) {
		return res.status(404).json({ error: "User not found" });
	}

	res.status(200).json({
		message: "Profile updated successfully",
		updateFields,
	});
};

const updatePrivacy = async (req, res) => {
	const existingFields = [
		"show_name",
		"show_email",
		"show_birth_date",
		"show_location",
	];

	const updateFields = {};

	for (const field of existingFields) {
		if (req.body[field] !== undefined) {
			updateFields[field] = req.body[field];
		}
	}

	const user = await User.update(updateFields, { where: { id: req.userId } });

	if (!user[0]) {
		return res.status(404).json({ error: "User not found" });
	}
	res.status(200).json({
		message: "Privacy settings updated successfully",
		privacy: updateFields,
	});
};

const updateLocation = async (req, res) => {
	const { latitude, longitude } = req.body;

	const user = await User.update(
		{ latitude, longitude },
		{ where: { id: req.userId } }
	);

	if (!user[0]) {
		return res.status(404).json({ error: "User not found" });
	}

	res.status(200).json({
		message: "Location updated successfully",
		location: {
			latitude,
			longitude,
		},
	});
};

const changePassword = async (req, res) => {
	const { new_password } = req.body;
	const hashed = await bcrypt.hash(new_password, 10);
	const user = await User.update(
		{ password: hashed },
		{ where: { id: req.userId } }
	);

	if (!user[0]) {
		return res.status(404).json({ error: "User not found" });
	}

	res.status(200).json({
		message: "Password changed successfully",
	});
};

const deleteUser = async (req, res) => {
	const user = await User.findByPk(req.userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	await Comment.destroy({ where: { UserId: req.userId } });
	await Rating.destroy({ where: { UserId: req.userId } });
	await Location.destroy({ where: { UserId: req.userId } });

	await user.destroy();

	res.sendStatus(204);
};

module.exports = {
	getProfile,
	getMyProfile,
	updateProfile,
	updatePrivacy,
	updateLocation,
	changePassword,
	deleteUser,
};
