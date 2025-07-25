const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Location = sequelize.define("Location", {
	name: { type: DataTypes.STRING, allowNull: false },
	address: { type: DataTypes.STRING, allowNull: false },
	latitude: { type: DataTypes.FLOAT, allowNull: false },
	longitude: { type: DataTypes.FLOAT, allowNull: false },
	images: { type: DataTypes.JSON, allowNull: false },
	details: { type: DataTypes.TEXT, allowNull: true, defaultValue: "" },
	type: {
		type: DataTypes.ENUM("RURAL", "GEOGRÁFICA", "HISTÓRICA"),
		allowNull: false,
	},
});

module.exports = Location;
