const express = require("express");
const pool = require("../config/db"); // Asegúrate de tener la conexión a la base de datos configurada
const router = express.Router();

// Crear una nueva nota
router.post("/", async (req, res) => {
	const { user_id, title, description, color, size, font, is_favorite, category } = req.body;

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
		console.error(error);
		res.status(500).json({ error: "Error al crear la nota" });
	}
});

// Obtener todas las notas de un usuario
router.get("/:user_id", async (req, res) => {
	const { user_id } = req.params;

	try {
		const notes = await pool.query("SELECT * FROM notes WHERE user_id = $1", [user_id]);
		res.status(200).json(notes.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al obtener las notas" });
	}
});

// Actualizar una nota
router.put("/:id", async (req, res) => {
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
		console.error(error);
		res.status(500).json({ error: "Error al actualizar la nota" });
	}
});

// Eliminar una nota
router.delete("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		await pool.query("DELETE FROM notes WHERE id = $1", [id]);
		res.status(200).json({ message: "Nota eliminada exitosamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al eliminar la nota" });
	}
});

// Buscar notas por título y user_id utilizando una solicitud POST
router.post("/search", async (req, res) => {
	const { user_id, query } = req.body; // Capturamos el user_id y el término de búsqueda

	if (!user_id || !query) {
		return res.status(400).json({ error: "Faltan user_id o término de búsqueda" });
	}

	try {
		// Hacemos la búsqueda solo en las notas del usuario (user_id) y por título
		const result = await pool.query("SELECT * FROM notes WHERE user_id = $1 AND title ILIKE $2", [user_id, `%${query}%`]);
		res.status(200).json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error en la búsqueda" });
	}
});

module.exports = router;
