const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../validators/user.validator");
const { validateRequest } = require("../middlewares/validate.middleware");

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

module.exports = router;
