const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const router = express.Router();

// Registro de usuarios
router.post("/register", async (req, res) => {
	const { first_name, last_name, username, email, password } = req.body;

	// Validación de correo electrónico
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ error: "El correo electrónico no es válido" });
	}

	// Validación de first_name (máximo 40 caracteres)
	if (first_name.length > 40) {
		return res.status(400).json({ error: "El nombre no debe exceder 40 caracteres" });
	}

	// Validación de last_name (máximo 40 caracteres)
	if (last_name.length > 40) {
		return res.status(400).json({ error: "El apellido no debe exceder 40 caracteres" });
	}

	// Validación de username (entre 8 y 40 caracteres)
	if (username.length < 8 || username.length > 40) {
		return res.status(400).json({ error: "El nombre de usuario debe tener entre 8 y 40 caracteres" });
	}

	// Validación de password (entre 8 y 40 caracteres)
	if (password.length < 8 || password.length > 40) {
		return res.status(400).json({ error: "La contraseña debe tener entre 8 y 40 caracteres" });
	}

	try {
		// Verificar si el email ya está registrado
		const existingEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
		if (existingEmail.rows.length > 0) {
			return res.status(400).json({ error: "El correo electrónico ya está registrado" });
		}

		// Verificar si el username ya está registrado
		const existingUsername = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
		if (existingUsername.rows.length > 0) {
			return res.status(400).json({ error: "El nombre de usuario ya está registrado" });
		}

		// Encriptar la contraseña
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insertar nuevo usuario en la base de datos
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
			// Si coincide con el formato de un correo, buscar por email
			user = await pool.query("SELECT * FROM users WHERE email = $1", [emailOrUsername]);
		} else {
			// Si no, buscar por nombre de usuario
			user = await pool.query("SELECT * FROM users WHERE username = $1", [emailOrUsername]);
		}

		// Si el usuario no fue encontrado
		if (user.rows.length === 0) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		// Comparar la contraseña
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

module.exports = router;
