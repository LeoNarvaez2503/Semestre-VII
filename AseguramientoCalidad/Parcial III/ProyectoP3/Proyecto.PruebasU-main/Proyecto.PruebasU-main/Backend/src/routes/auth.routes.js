const express = require('express');
const { login, getProfile } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para login
router.post('/login', login);

// Ruta protegida para obtener perfil
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
