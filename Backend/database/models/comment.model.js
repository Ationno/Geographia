const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Comment = sequelize.define("Comment", {
	comment_text: { type: DataTypes.TEXT, allowNull: false },
	location_shared: { type: DataTypes.BOOLEAN, defaultValue: false },
	location_comment: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Comment;
