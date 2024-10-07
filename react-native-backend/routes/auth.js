const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const router = express.Router();

// Registro de usuarios
router.post("/register", async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [username, email, hashedPassword]);
		res.status(201).json(newUser.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Error al registrar usuario" });
	}
});

// Inicio de sesión
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
		if (user.rows.length === 0) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}
		const validPassword = await bcrypt.compare(password, user.rows[0].password);
		if (!validPassword) {
			return res.status(401).json({ error: "Contraseña incorrecta" });
		}
		const token = jwt.sign({ id: user.rows[0].id }, "secreto", { expiresIn: "1h" });
		res.json({ token });
	} catch (error) {
		res.status(500).json({ error: "Error al iniciar sesión" });
	}
});

module.exports = router;
