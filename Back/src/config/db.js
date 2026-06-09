const sql = require("mssql");

// Sube dos niveles desde src/config/ para encontrar el .env en la raíz de back
require("dotenv").config({ path: require('path').join(__dirname, '../../.env') });

console.log("DB_SERVER =", process.env.DB_SERVER);
console.log("DB_INSTANCE =", process.env.DB_INSTANCE);
console.log("DB_DATABASE =", process.env.DB_DATABASE);

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    instanceName: process.env.DB_INSTANCE,
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

async function getConnection() {
  try {
    return await sql.connect(dbConfig);
  } catch (error) {
    console.log("ERROR SQL SERVER");
    console.log("DETALLE:", error.message);
    throw error;
  }
}

module.exports = { sql, getConnection };