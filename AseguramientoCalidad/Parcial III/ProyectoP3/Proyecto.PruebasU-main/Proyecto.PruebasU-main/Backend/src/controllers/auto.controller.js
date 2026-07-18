const { Auto } = require('../models');

async function getAllAutos(req, res) {
    try {
        const autos = await Auto.find();
        res.json(autos);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

async function getAutoById(req, res) {
    try {
        const { id } = req.params;
        const auto = await Auto.findById(id);
        if (!auto) return res.status(404).json({ message: 'Auto no encontrado' });
        res.json(auto);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// Handle validation errors for auto
function handleAutoValidationError(error, res) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
        return res.status(400).json({ message: 'El número de serie ya existe' });
    }
    return false;
}

async function addNewAuto(req, res) {
    try {
        const { marca, modelo, año, color, numeroSerie } = req.body;

        const newAuto = new Auto({ marca, modelo, año, color, numeroSerie });
        const savedAuto = await newAuto.save();
        res.status(201).json({ message: 'Auto creado exitosamente', data: savedAuto });
    } catch (error) {
        if (handleAutoValidationError(error, res)) return;
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// Handle update errors for auto
function handleUpdateError(error, res) {
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID inválido' });
    }
    if (handleAutoValidationError(error, res)) return true;
    return false;
}

async function updateAuto(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedAuto = await Auto.findByIdAndUpdate(
            id, updateData, { new: true, runValidators: true }
        );

        if (!updatedAuto) return res.status(404).json({ message: 'Auto no encontrado' });
        res.json({ message: 'Auto actualizado exitosamente', data: updatedAuto });
    } catch (error) {
        if (handleUpdateError(error, res)) return;
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

async function deleteAuto(req, res) {
    try {
        const { id } = req.params;
        const deletedAuto = await Auto.findByIdAndDelete(id);

        if (!deletedAuto) return res.status(404).json({ message: 'Auto no encontrado' });

        res.json({
            message: 'Auto eliminado exitosamente',
            data: deletedAuto
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}

// Helper de pruebas: limpia la colección de autos 
/* istanbul ignore next */
async function _clearAutos() {
    try {
        await Auto.deleteMany({});
    } catch (_error) {
        _error.message = 'Error eliminando cliente: ' + _error.message;
        // Error clearing autos
    }
}

module.exports = { getAllAutos, getAutoById, addNewAuto, updateAuto, deleteAuto, _clearAutos };
