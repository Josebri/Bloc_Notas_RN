const { Pool } = require("pg");

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "note-rn",
	password: "29930427",
	port: 5432,
});

module.exports = pool;
