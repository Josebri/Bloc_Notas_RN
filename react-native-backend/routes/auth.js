const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const router = express.Router();

// Middleware para autenticar token JWT
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.status(401).json({ error: "Token no proporcionado" });

	jwt.verify(token, "secreto", (err, user) => {
		if (err) return res.status(403).json({ error: "Token no válido" });
		req.user = user;
		next();
	});
};

// Registro de usuarios
router.post("/register", async (req, res) => {
	const { first_name, last_name, username, email, password } = req.body;

	// Validación de correo electrónico
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ error: "El correo electrónico no es válido" });
	}

	// Validaciones adicionales para nombres, username y contraseña...
	if (first_name.length > 40 || last_name.length > 40 || username.length < 8 || username.length > 40 || password.length < 8 || password.length > 40) {
		return res.status(400).json({ error: "Los datos ingresados no cumplen con los requisitos" });
	}

	try {
		// Verificar si el email o username ya está registrado
		const existingEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
		const existingUsername = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

		if (existingEmail.rows.length > 0 || existingUsername.rows.length > 0) {
			return res.status(400).json({ error: "Correo electrónico o nombre de usuario ya registrado" });
		}

		// Encriptar la contraseña y registrar el usuario
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await pool.query("INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *", [first_name, last_name, username, email, hashedPassword]);

		res.status(201).json(newUser.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al registrar usuario" });
	}
});

// Inicio de sesión
router.post("/login", async (req, res) => {
	const { emailOrUsername, password } = req.body;

	try {
		// Verificar si es un correo o un nombre de usuario
		let user;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (emailRegex.test(emailOrUsername)) {
			user = await pool.query("SELECT * FROM users WHERE email = $1", [emailOrUsername]);
		} else {
			user = await pool.query("SELECT * FROM users WHERE username = $1", [emailOrUsername]);
		}

		if (user.rows.length === 0) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		const validPassword = await bcrypt.compare(password, user.rows[0].password);
		if (!validPassword) {
			return res.status(401).json({ error: "Contraseña incorrecta" });
		}

		// Generar el token JWT
		const token = jwt.sign({ id: user.rows[0].id }, "secreto", { expiresIn: "1h" });
		res.json({ token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al iniciar sesión" });
	}
});

// Nueva ruta: Obtener datos del perfil del usuario autenticado
router.get("/profile", authenticateToken, async (req, res) => {
	try {
		const user = await pool.query("SELECT first_name, last_name, email, username FROM users WHERE id = $1", [req.user.id]);

		if (user.rows.length === 0) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		res.json(user.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al obtener los datos del perfil" });
	}
});

// Nueva ruta: Eliminar cuenta de usuario autenticado
router.delete("/delete", authenticateToken, async (req, res) => {
	try {
		// Eliminar el usuario de la base de datos
		const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [req.user.id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		res.json({ message: "Cuenta eliminada exitosamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al eliminar la cuenta" });
	}
});

module.exports = router;
