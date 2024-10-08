const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const app = express();
const notesRoutes = require("./routes/notes");

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
