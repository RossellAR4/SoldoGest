require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectDB, sequelize } = require('./src/config/database');

// Importante: cargar modelos para registrar asociaciones
require('./src/models');

const app = express();

// =====================
// Middlewares globales
// =====================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =====================
// Rutas v1
// =====================
app.use('/api/v1', require('./src/routes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SoldoGest API running ✅' });
});

// =====================
// 404
// =====================
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// =====================
// Arranque
// =====================
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await connectDB();

    // Solo en desarrollo. En producción usa migraciones.
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 API corriendo en http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Error arrancando el servidor:', error);
    process.exit(1);
  }
})();