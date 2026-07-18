const express = require('express');
const { getAllClientes, addNewCliente, getClienteById, updateCliente, deleteCliente } = require('../controllers/cliente.controller');

const router = express.Router();

// Ruta GET para obtener todos los clientes
router.get('/', getAllClientes);

// Ruta GET para obtener un cliente mediante su id
router.get('/:id', getClienteById);

// Ruta POST para crear un nuevo cliente
router.post('/', addNewCliente);

// Ruta PUT para modificar un cliente mediante su id
router.put('/:id', updateCliente);

// Ruta DELETE para eliminar un cliente mediante su id
router.delete('/:id', deleteCliente);

module.exports = router;
