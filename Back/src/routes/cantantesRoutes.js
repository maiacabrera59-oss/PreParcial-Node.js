const express = require("express");

const router = express.Router();

const { obtenerCantantes, crearCantantes, eliminarCantantes } = require("../controllers/cantantesController");

router.get("/", obtenerCantantes);

router.post("/", crearCantantes);

router.delete("/:id", eliminarCantantes);

module.exports = router;