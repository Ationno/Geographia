const app = require("./app");
const db = require("./database/db");

require("./database/models");

const PORT = process.env.PORT || 3000;

(async () => {
	try {
		await db.authenticate();
		console.log("DB connected");

		if (process.env.DB_SYNC === "force") {
			await db.sync({ force: true });
			console.log("DB synchronized (force)");
		} else if (
			process.env.DB_SYNC === "alter" ||
			process.env.NODE_ENV === "development"
		) {
			await db.sync({ alter: true });
			console.log("DB synchronized (alter)");
		}

		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	} catch (err) {
		console.error("Unable to connect to the database:", err);
		process.exit(1);
	}
})();

process.on("SIGINT", async () => {
  console.log("Closing DB connection...");
  await db.close();
  console.log("DB connection closed. Exiting.");
  process.exit(0);
});