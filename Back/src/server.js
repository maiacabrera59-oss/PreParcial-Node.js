const express = require("express");
const cors = require("cors");
const path = require("path");

// Carga el .env subiendo un nivel desde src/
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const cantantesRoutes = require("./routes/cantantesRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// OJO: Cambiaste la ruta a /api/cantantes, asegúrate de usar esta misma en el fetch de tu app.js
app.use("/api/cantantes", cantantesRoutes);

app.get("/", (req, res) => {
  res.send("API Cantantes funcionando");
});

console.log("ENV cargado en server.js:");
console.log("DB_SERVER =", process.env.DB_SERVER);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});