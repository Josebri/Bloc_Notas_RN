const express = require("express");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware para autenticar y extraer el token JWT
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Token no proporcionado" });
	}

	jwt.verify(token, "secreto", (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Token no válido" });
		}
		req.user = user; // Aquí extraemos el user_id
		next();
	});
};

// Ruta para crear una nota
router.post("/", authenticateToken, async (req, res) => {
	const { title, description, color, size, font, is_favorite, category } = req.body;
	const user_id = req.user.id;

	// Validaciones
	if (title.length > 100) {
		return res.status(400).json({ error: "El título no debe exceder los 100 caracteres" });
	}
	if (description.length > 250) {
		return res.status(400).json({ error: "La descripción no debe exceder los 250 caracteres" });
	}
	if (category.length > 40) {
		return res.status(400).json({ error: "La categoría no debe exceder los 40 caracteres" });
	}

	try {
		const newNote = await pool.query("INSERT INTO notes (user_id, title, description, color, size, font, is_favorite, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [user_id, title, description, color, size, font, is_favorite, category]);
		res.status(201).json(newNote.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Error al crear la nota" });
	}
});

// Obtener todas las notas favoritas de un usuario
router.get("/favorite", authenticateToken, async (req, res) => {
	const user_id = req.user.id;

	try {
		const notes = await pool.query("SELECT * FROM notes WHERE user_id = $1 AND is_favorite = true", [user_id]);
		res.status(200).json(notes.rows);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener las notas favoritas" });
	}
});

// Obtener todas las notas no favoritas de un usuario
router.get("/unfavorite", authenticateToken, async (req, res) => {
	const user_id = req.user.id;

	try {
		const notes = await pool.query("SELECT * FROM notes WHERE user_id = $1 AND is_favorite = false", [user_id]);
		res.status(200).json(notes.rows);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener las notas" });
	}
});

// Obtener los detalles de una nota por su id
router.get("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params; // Obtenemos el id de la nota

	try {
		const note = await pool.query("SELECT * FROM notes WHERE id = $1 AND user_id = $2", [id, req.user.id]);
		if (note.rows.length > 0) {
			res.status(200).json(note.rows[0]); // Retorna la nota encontrada
		} else {
			res.status(404).json({ error: "Nota no encontrada" });
		}
	} catch (error) {
		console.error("Error al obtener la nota:", error);
		res.status(500).json({ error: "Error al obtener la nota" });
	}
});

// Ruta para cambiar el estado de favorito de una nota
router.put("/:id/favorite", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { is_favorite } = req.body;

	try {
		// Actualizamos solo el campo "is_favorite"
		const updatedNote = await pool.query("UPDATE notes SET is_favorite = $1 WHERE id = $2 AND user_id = $3 RETURNING *", [is_favorite, id, req.user.id]);

		if (updatedNote.rows.length > 0) {
			res.status(200).json(updatedNote.rows[0]); // Retornar la nota actualizada
		} else {
			res.status(404).json({ error: "Nota no encontrada" });
		}
	} catch (error) {
		console.error("Error al cambiar el estado de favorito:", error);
		res.status(500).json({ error: "Error al cambiar el estado de favorito" });
	}
});

// Actualizar una nota
router.put("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { title, description, color, size, font, is_favorite, category } = req.body;

	// Validaciones
	if (title.length > 100) {
		return res.status(400).json({ error: "El título no debe exceder los 100 caracteres" });
	}
	if (description.length > 250) {
		return res.status(400).json({ error: "La descripción no debe exceder los 250 caracteres" });
	}
	if (category.length > 40) {
		return res.status(400).json({ error: "La categoría no debe exceder los 40 caracteres" });
	}

	try {
		const updatedNote = await pool.query("UPDATE notes SET title = $1, description = $2, color = $3, size = $4, font = $5, is_favorite = $6, category = $7 WHERE id = $8 RETURNING *", [title, description, color, size, font, is_favorite, category, id]);
		res.status(200).json(updatedNote.rows[0]);
	} catch (error) {
		res.status(500).json({ error: "Error al actualizar la nota" });
	}
});

// Eliminar una nota
router.delete("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;

	try {
		await pool.query("DELETE FROM notes WHERE id = $1", [id]);
		res.status(200).json({ message: "Nota eliminada exitosamente" });
	} catch (error) {
		res.status(500).json({ error: "Error al eliminar la nota" });
	}
});

// Buscar notas por título y user_id utilizando una solicitud POST
router.post("/search", authenticateToken, async (req, res) => {
	const { user_id, query } = req.body;

	if (!user_id || !query) {
		return res.status(400).json({ error: "Faltan user_id o término de búsqueda" });
	}

	try {
		const result = await pool.query("SELECT * FROM notes WHERE user_id = $1 AND title ILIKE $2", [user_id, `%${query}%`]);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: "Error en la búsqueda" });
	}
});

module.exports = router;
