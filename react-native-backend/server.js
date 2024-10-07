const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
