const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ API Tienda de Ropa funcionando',
    version: '1.0.0'
  });
});

// Rutas de la API
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/usuarios', require('./src/routes/usuarios.routes'));
app.use('/api/productos', require('./src/routes/productos.routes'));
app.use('/api/ventas', require('./src/routes/ventas.routes'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});