const express = require('express');
const { getAllAutos, getAutoById, addNewAuto, updateAuto, deleteAuto } = require('../controllers/auto.controller');

const router = express.Router();

// Ruta GET para obtener todos los autos
router.get('/', getAllAutos);

// Ruta GET para obtener un auto por ID
router.get('/:id', getAutoById);

// Ruta POST para crear un nuevo auto
router.post('/', addNewAuto);

// Ruta PUT para modificar un auto mediante su id
router.put('/:id', updateAuto);

// Ruta DELETE para eliminar un auto mediante su id
router.delete('/:id', deleteAuto);

module.exports = router;
