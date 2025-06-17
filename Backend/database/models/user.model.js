const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
	first_name: { type: DataTypes.STRING, allowNull: false },
	last_name: { type: DataTypes.STRING, allowNull: false },
	email: { type: DataTypes.STRING, unique: true, allowNull: false },
	password: { type: DataTypes.STRING, allowNull: false },
	birth_date: { type: DataTypes.DATEONLY, allowNull: false },
	latitude: { type: DataTypes.FLOAT, allowNull: true },
	longitude: { type: DataTypes.FLOAT, allowNull: true },
	profile_image_url: { type: DataTypes.TEXT, allowNull: true },
	show_name: { type: DataTypes.BOOLEAN, defaultValue: true },
	show_email: { type: DataTypes.BOOLEAN, defaultValue: true },
	show_birth_date: { type: DataTypes.BOOLEAN, defaultValue: true },
	show_location: { type: DataTypes.BOOLEAN, defaultValue: true },

	role: {
		type: DataTypes.ENUM("viewer", "uploader"),
		allowNull: false,
		defaultValue: "viewer",
	},
});

module.exports = User;
