const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Rating = sequelize.define("Rating", {
	score: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 5,
		},
	},
});

module.exports = Rating;
