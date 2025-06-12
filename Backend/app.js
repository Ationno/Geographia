const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const locationRoutes = require("./routes/location.routes");
const commentRoutes = require("./routes/comment.routes");

app.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to the API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/comments", commentRoutes);

app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({
		message: "Internal Server Error",
	});
	next();
});

module.exports = app;
