const User = require("./user.model");
const Location = require("./location.model");
const Comment = require("./comment.model");
const Tag = require("./tag.model");
const Rating = require("./rating.model");

User.hasMany(Location, { onDelete: "CASCADE" });
Location.belongsTo(User);

Location.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(Location);

User.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(User);

Location.belongsToMany(Tag, { through: "location_tags" });
Tag.belongsToMany(Location, { through: "location_tags" });

Rating.belongsTo(User);
Rating.belongsTo(Location);

User.hasMany(Rating, { onDelete: "CASCADE" });
Location.hasMany(Rating, { onDelete: "CASCADE" });

module.exports = { User, Location, Comment, Tag, Rating };
