const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000
});

const promisePool = pool.promise();

// Función para intentar conectar con reintentos
const connectWithRetry = (retries = 5, delay = 5000) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Error conectando a MySQL:', err.message);
      if (retries > 0) {
        console.log(`🔄 Reintentando conexión en ${delay/1000} segundos... (${retries} intentos restantes)`);
        setTimeout(() => connectWithRetry(retries - 1, delay), delay);
      } else {
        console.error('💥 No se pudo conectar a MySQL después de varios intentos');
      }
    } else {
      console.log('✅ Conectado a MySQL');
      connection.release();
    }
  });
};

// Iniciar conexión con reintentos
connectWithRetry();

module.exports = promisePool;