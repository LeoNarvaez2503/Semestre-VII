require('dotenv').config();
const express = require('express');
const database = require('./config/database');
const autoRoutes = require('./routes/auto.routes');
const vendorRoutes = require('./routes/vendor.route');
const clienteRoutes = require('./routes/cliente.routes');
const concesionariaRoutes = require('./routes/concesionaria.routes');
const authRoutes = require('./routes/auth.routes');
const { authMiddleware } = require('./middleware/authMiddleware');
const { createDefaultAdmin } = require('./controllers/auth.controller');

const app = express();

// Conectar a MongoDB
database.connect().then(() => {
    // Crear datos iniciales después de conectar
    createDefaultAdmin();
}).catch(_error => {
    // Silently handle startup errors
});

// middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    // Responder OPTIONS inmediatamente
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());

// Agregada ruta raíz para estado / pruebas
app.get('/', (req, res) => {
    res.json({
        message: 'API Concesionarias - Backend activo',
        database: database.getConnectionState() === 1 ? 'Conectado' : 'Desconectado',
        timestamp: new Date().toISOString()
    });
});

// Rutas de autenticación (sin protección)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Rutas Base de cada modelo (con y sin prefijo /api para compatibilidad)
// Protegidas con autenticación
app.use('/api/autos', authMiddleware, autoRoutes);
app.use('/autos', authMiddleware, autoRoutes);
app.use('/api/vendedores', authMiddleware, vendorRoutes);
app.use('/vendedores', authMiddleware, vendorRoutes);
app.use('/api/clientes', authMiddleware, clienteRoutes);
app.use('/clientes', authMiddleware, clienteRoutes);
app.use('/api/concesionarias', authMiddleware, concesionariaRoutes);
app.use('/concesionarias', authMiddleware, concesionariaRoutes);

// manejo simple de 404
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Manejo de errores globales
app.use((error, req, res, _next) => {
    // Log error in development only
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// iniciar servidor si se ejecuta con `node app.js`
/* istanbul ignore if */
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        // Server started on port
    });
}
 

module.exports = app;