const { User } = require("../database/models");
const { Comment } = require("../database/models");
const { Rating } = require("../database/models");
const { Location } = require("../database/models");
const bcrypt = require("bcrypt");
const defaultImage = "/uploads/default_profile.jpg";
const fs = require("fs");
const path = require("path");

const deleteOldImage = (imageUrl) => {
	if (imageUrl && imageUrl !== defaultImage) {
		const oldImagePath = path.join(__dirname, "..", imageUrl);
		fs.unlink(oldImagePath, (err) => {
			if (err) {
				console.error("Error deleting old image:", err.message);
			}
		});
	}
};

const getMyProfile = async (req, res) => {
	const user = await User.findByPk(req.userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const { password, ...userWithoutPassword } = user.toJSON();

	if (userWithoutPassword.profile_image_url) {
		userWithoutPassword.profile_image_url = `${req.protocol}://${req.get(
			"host"
		)}${userWithoutPassword.profile_image_url}`;
	}

	res.json(userWithoutPassword);
};

const getProfile = async (req, res) => {
	const user = await User.findByPk(req.params.id);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const { password, ...userWithoutPassword } = user.toJSON();

	if (userWithoutPassword.profile_image_url) {
		userWithoutPassword.profile_image_url = `${req.protocol}://${req.get(
			"host"
		)}${userWithoutPassword.profile_image_url}`;
	}

	if (!userWithoutPassword.show_location) {
		delete userWithoutPassword.latitude;
		delete userWithoutPassword.longitude;
	}
	if (!userWithoutPassword.show_email) {
		delete userWithoutPassword.email;
	}
	if (!userWithoutPassword.show_birth_date) {
		delete userWithoutPassword.birth_date;
	}
	if (!userWithoutPassword.show_name) {
		delete userWithoutPassword.first_name;
		delete userWithoutPassword.last_name;
	}

	res.json(userWithoutPassword);
};

const updateProfile = async (req, res) => {
	const existingFields = ["first_name", "last_name", "email", "birth_date"];

	const updateFields = {};

	const user = await User.findByPk(req.userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

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

	if (req.file) {
		deleteOldImage(user.profile_image_url);
		updateFields.profile_image_url = `/uploads/${req.file.filename}`;
	} else if (req.body.remove_profile_image) {
		deleteOldImage(user.profile_image_url);
		updateFields.profile_image_url = defaultImage;
	}

	await User.update(updateFields, { where: { id: req.userId } });

	if (updateFields.profile_image_url) {
		updateFields.profile_image_url = `${req.protocol}://${req.get("host")}${
			updateFields.profile_image_url
		}`;
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
	const { actual_password, new_password } = req.body;
	const hashed = await bcrypt.hash(new_password, 10);

	const user = await User.findByPk(req.userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	if (await bcrypt.compare(actual_password, user.password)) {
		return res.status(400).json({ error: "Actual password is incorrect" });
	}

	if (await bcrypt.compare(new_password, user.password)) {
		return res
			.status(400)
			.json({ error: "New password cannot be the same as the old one" });
	}

	await user.update({ password: hashed });

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
