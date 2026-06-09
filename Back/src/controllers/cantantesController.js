const { sql, getConnection } = require("../config/db");

async function probarConexion(req, res) {

  try {

    const pool = await getConnection();

    const resultado = await pool.request().query("SELECT 1 AS ok");

    res.json({ ok: true, mensaje: "Conexión correcta con SQL Server", resultado: resultado.recordset });

  } catch (error) {

    res.status(500).json({ ok: false, mensaje: "No se pudo conectar con SQL Server", error: error.message });

  }

}

async function obtenerCantantes(req, res) {

  try {

    const pool = await getConnection();

    const resultado = await pool.request().query(`

      SELECT Id AS id, Nombre AS nombre, Edad AS edad, Genero AS genero, Casado AS casado

      FROM Cantantes

      ORDER BY Id DESC

    `);

    res.json(resultado.recordset);

  } catch (error) {

    res.status(500).json({ mensaje: "Error al obtener cantantes", error: error.message });

  }

}

async function crearCantantes(req, res) {

  try {

    const { nombre, genero, edad, casado } = req.body;

    if (!nombre || !genero || edad === undefined || casado === undefined) {

      return res.status(400).json({ mensaje: "Debe completar todos los datos" });

    }

    const pool = await getConnection();

    const resultado = await pool.request()

      .input("nombre", sql.NVarChar(100), nombre)

      .input("genero", sql.NVarChar(50), genero)

      .input("edad", sql.Int, Number(edad))

      .input("casado", sql.Bit, casado === true || casado === "true")

      .query(`

        INSERT INTO Cantantes (Nombre, Genero, Edad, Casado)

        OUTPUT INSERTED.Id AS id, INSERTED.Nombre AS nombre, INSERTED.Genero AS genero,

               INSERTED.Edad AS edad, INSERTED.Casado AS casado

        VALUES (@nombre, @genero, @edad, @casado)

      `);

    res.status(201).json({ mensaje: "Cantante guardado correctamente", cantante: resultado.recordset[0] });

  } catch (error) {

    res.status(500).json({ mensaje: "Error al guardar cantante", error: error.message });

  }

}

async function eliminarCantantes(req, res) {

  try {

    const { id } = req.params;

    const pool = await getConnection();

    const resultado = await pool.request()

      .input("id", sql.Int, Number(id))

      .query("DELETE FROM Cantantes WHERE Id = @id");

    if (resultado.rowsAffected[0] === 0) {

      return res.status(404).json({ mensaje: "Cantante no encontrado" });

    }

    res.json({ mensaje: "Cantante eliminado correctamente" });

  } catch (error) {

    res.status(500).json({ mensaje: "Error al eliminar cantante", error: error.message });

  }

}

module.exports = { probarConexion, obtenerCantantes, crearCantantes, eliminarCantantes };