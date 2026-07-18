const mongoose = require('mongoose');

const concesionariaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es requerida'],
        trim: true,
        maxlength: [200, 'La dirección no puede exceder 200 caracteres']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        trim: true,
        maxlength: [15, 'El teléfono no puede exceder 15 caracteres']
    },
    ciudad: {
        type: String,
        required: [true, 'La ciudad es requerida'],
        trim: true,
        maxlength: [50, 'La ciudad no puede exceder 50 caracteres']
    },
    gerente: {
        type: String,
        required: [true, 'El gerente es requerido'],
        trim: true,
        maxlength: [100, 'El gerente no puede exceder 100 caracteres']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Concesionaria', concesionariaSchema);