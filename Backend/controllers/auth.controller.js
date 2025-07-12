const { User } = require("../database/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
	const { first_name, last_name, email, birth_date, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await User.findOne({ where: { email } });
	if (existingUser) {
		return res.status(400).json({ error: "User already exists" });
	}

	const user = await User.create({
		first_name,
		last_name,
		email,
		birth_date,
		password: hashedPassword,
		profile_image_url: "/uploads/default_profile.jpg",
	});

	res.status(201).json({
		message: "User registered successfully",
		user: {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			birth_date: user.birth_date,
		},
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ where: { email } });

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	if (!(await bcrypt.compare(password, user.password)))
		return res.status(401).json({ error: "Unauthorized" });
	const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION || "1h",
	});
	res.json({ token });
};

module.exports = {
	register,
	login,
};
