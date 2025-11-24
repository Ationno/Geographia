// database/db.js
const { Sequelize } = require("sequelize");
const mysql2 = require("mysql2");
require("dotenv").config();

function toBool(v) {
	if (v === true) return true;
	if (!v) return false;
	const s = String(v).toLowerCase().trim();
	return ["true", "1", "yes", "y"].includes(s);
}

const WAIT_TIMEOUT_S = Number(process.env.DB_WAIT_TIMEOUT_S || 300);
const IDLE_MS = Math.max(10000, (WAIT_TIMEOUT_S - 30) * 1000);
const KEEPALIVE = toBool(process.env.DB_KEEPALIVE || "true");
const KEEPALIVE_MS = Number(process.env.DB_KEEPALIVE_MS || 240000);
const USE_SSL = toBool(process.env.DB_SSL || "false");

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT || 3306),
		dialect: "mysql",
		dialectModule: mysql2,
		logging: false,
		pool: {
			max: Number(process.env.DB_POOL_MAX || 10),
			min: Number(process.env.DB_POOL_MIN || (KEEPALIVE ? 1 : 0)),
			idle: IDLE_MS,
			acquire: Number(process.env.DB_POOL_ACQUIRE_MS || 60000),
			evict: Number(process.env.DB_POOL_EVICT_MS || 1000),
		},
		retry: { max: Number(process.env.DB_RETRY_MAX || 3) },
		dialectOptions: {
			connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS || 60000),
			enableKeepAlive: true,
			keepAliveInitialDelay: 0,
			decimalNumbers: true,
			...(USE_SSL ? { ssl: { rejectUnauthorized: false } } : {}),
		},
	}
);

if (KEEPALIVE) {
	const interval = setInterval(async () => {
		try {
			await sequelize.query("SELECT 1");
		} catch (err) {
			try {
				await sequelize.authenticate();
			} catch (_) {
			}
		}
	}, KEEPALIVE_MS);
	interval.unref();
}

module.exports = sequelize;
