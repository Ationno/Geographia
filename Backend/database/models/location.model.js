const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Location = sequelize.define("Location", {
	address: { type: DataTypes.STRING, allowNull: false },
	coordinates: { type: DataTypes.STRING, allowNull: false },
	rating: { type: DataTypes.INTEGER, allowNull: false },
	images: { type: DataTypes.JSON, allowNull: false },
	details: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = Location;
