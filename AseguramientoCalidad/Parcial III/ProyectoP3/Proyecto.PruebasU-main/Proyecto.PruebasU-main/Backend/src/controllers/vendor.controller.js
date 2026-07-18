const { Vendedor } = require('../models');

// Handle vendor validation errors
function handleVendorValidationError(error, res) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const message = field === 'email' ? 'El email ya está registrado' : 'El código de empleado ya está registrado';
        return res.status(409).json({ message });
    }
    return false;
}

// POST: Crear vendedor
async function createVendor(req, res) {
    try {
        const { name, email, telefono, comision, codigoEmpleado } = req.body;
        const newVendedor = new Vendedor({ name, email, telefono, comision, codigoEmpleado });
        const savedVendedor = await newVendedor.save();
        return res.status(201).json(savedVendedor);
    } catch (error) {
        if (handleVendorValidationError(error, res)) return;
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// GET: obtener todos los vendedores
async function getAllVendors(req, res) {
    try {
        const vendedores = await Vendedor.find();
        res.json(vendedores);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// GET: obtener un vendedor por ID
async function getVendorById(req, res) {
    try {
        const { id } = req.params;
        const vendedor = await Vendedor.findById(id);

        if (!vendedor)
            return res.status(404).json({ message: 'Vendedor no encontrado' });

        res.json(vendedor);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// Handle vendor update errors
function handleVendorUpdateError(error, res) {
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID inválido' });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const message = field === 'email' ? 'El email ya está registrado por otro vendedor' : 'El código de empleado ya está registrado';
        return res.status(409).json({ message });
    }
    return false;
}

// PUT: actualizar vendedor
async function updateVendor(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedVendedor = await Vendedor.findByIdAndUpdate(
            id, updateData, { new: true, runValidators: true }
        );

        if (!updatedVendedor) return res.status(404).json({ message: 'Vendedor no encontrado' });
        res.json(updatedVendedor);
    } catch (error) {
        if (handleVendorUpdateError(error, res)) return;
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// DELETE: eliminar vendedor
async function deleteVendor(req, res) {
    try {
        const { id } = req.params;
        const deletedVendedor = await Vendedor.findByIdAndDelete(id);

        if (!deletedVendedor)
            return res.status(404).json({ message: 'Vendedor no encontrado' });

        res.status(200).json({ message: 'Vendedor eliminado exitosamente' });
    } catch (error) {
        error.message = 'Error seeding database: ' + error.message;
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// Helper de pruebas
/* istanbul ignore next */
async function _clearVendedores() {
    try {
        await Vendedor.deleteMany({});
    } catch (error) {
        error.message = 'Error clearing vendedores: ' + error.message;
        // Error clearing vendedores
    }
}

module.exports = {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    _clearVendedores
};
