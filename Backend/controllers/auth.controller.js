const { User } = require("../database/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
	const { first_name, last_name, email, birth_date, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({
		first_name,
		last_name,
		email,
		birth_date,
		password: hashedPassword,
	});
	res.status(201).json(user);
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ where: { email } });
	if (!user || !(await bcrypt.compare(password, user.password)))
		return res.status(401).json({ error: "Unauthorized" });
	const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
	res.json({ token });
};

module.exports = {
	register,
	login,
};
