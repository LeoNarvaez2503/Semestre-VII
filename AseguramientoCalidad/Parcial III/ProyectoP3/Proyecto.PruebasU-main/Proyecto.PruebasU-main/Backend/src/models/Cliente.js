const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no tiene un formato válido']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        trim: true,
        maxlength: [15, 'El teléfono no puede exceder 15 caracteres']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es requerida'],
        trim: true,
        maxlength: [200, 'La dirección no puede exceder 200 caracteres']
    },
    ciudad: {
        type: String,
        required: [true, 'La ciudad es requerida'],
        trim: true,
        maxlength: [50, 'La ciudad no puede exceder 50 caracteres']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);