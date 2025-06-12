const User = require("./user.model");
const Location = require("./location.model");
const Comment = require("./comment.model");
const Tag = require("./tag.model");

User.hasMany(Location);
Location.belongsTo(User);

Location.hasMany(Comment);
Comment.belongsTo(Location);

User.hasMany(Comment);
Comment.belongsTo(User);

Location.belongsToMany(Tag, { through: "location_tags" });
Tag.belongsToMany(Location, { through: "location_tags" });

module.exports = { User, Location, Comment, Tag };
