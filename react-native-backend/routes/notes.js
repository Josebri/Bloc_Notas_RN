const express = require("express");
const pool = require("../config/db"); // Asegúrate de tener la conexión a la base de datos configurada
const router = express.Router();

// Crear una nueva nota
router.post("/", async (req, res) => {
	const { user_id, title, description, color, size, font, is_favorite } = req.body;

	// Validaciones
	if (title.length > 100) {
		return res.status(400).json({ error: "El título no debe exceder los 100 caracteres" });
	}
	if (description.length > 250) {
		return res.status(400).json({ error: "La descripción no debe exceder los 250 caracteres" });
	}

	try {
		const newNote = await pool.query("INSERT INTO notes (user_id, title, description, color, size, font, is_favorite) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [user_id, title, description, color, size, font, is_favorite]);
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
		// Obtener las notas y ordenarlas por favoritos (is_favorite)
		const notes = await pool.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY is_favorite DESC", [user_id]);
		res.status(200).json(notes.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al obtener las notas" });
	}
});

// Actualizar una nota
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { title, description, color, size, font, is_favorite } = req.body; // Quitamos priority

	// Validaciones
	if (title.length > 100) {
		return res.status(400).json({ error: "El título no debe exceder los 100 caracteres" });
	}
	if (description.length > 250) {
		return res.status(400).json({ error: "La descripción no debe exceder los 250 caracteres" });
	}

	try {
		const updatedNote = await pool.query("UPDATE notes SET title = $1, description = $2, color = $3, size = $4, font = $5, is_favorite = $6 WHERE id = $7 RETURNING *", [title, description, color, size, font, is_favorite, id]);
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

module.exports = router;
