const app = require("./app");
const db = require("./database/db");
require("./database/models");

const PORT = process.env.PORT || 3000;

async function waitForDb() {
	const maxDelay = Number(process.env.DB_INIT_MAX_DELAY_MS || 30000);
	let attempt = 0;
	while (true) {
		try {
			await db.authenticate();
			console.log("DB connected");
			return;
		} catch (err) {
			attempt++;
			const delay = Math.min(maxDelay, 1000 * Math.pow(2, attempt)); // backoff exponencial
			console.error(
				`DB not ready (attempt ${attempt}): ${
					err.code || err.message
				}. Retrying in ${delay}ms`
			);
			await new Promise((r) => setTimeout(r, delay));
		}
	}
}

(async () => {
	await waitForDb();

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
})();

process.on("SIGINT", async () => {
	console.log("Closing DB connection...");
	try {
		await db.close();
	} catch {}
	console.log("DB connection closed. Exiting.");
	process.exit(0);
});
