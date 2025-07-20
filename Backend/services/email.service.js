// services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: false,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

const sendEmail = async (to, code) => {
	const mailOptions = {
		from: "Geographia <no-reply@geographia.com>",
		to,
		subject: "Código para restablecer tu contraseña",
		html: `<p>Tu código de verificación es: <b>${code}</b></p>`,
	};

	console.log("Sending email to:", to);

	try {
		await transporter.sendMail(mailOptions);
	} catch (err) {
		console.error("Error sending email:", err.message, err.response, err.stack);
		throw new Error("Failed to send email");
	}
};

module.exports = { sendEmail };
