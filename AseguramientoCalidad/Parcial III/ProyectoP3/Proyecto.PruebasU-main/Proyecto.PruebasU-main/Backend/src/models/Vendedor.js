const mongoose = require('mongoose');

const vendedorSchema = new mongoose.Schema({
    name: {
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
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no es válido']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        trim: true,
        match: [/^[0-9]{7,15}$/, 'El teléfono debe contener solo números y tener entre 7 y 15 dígitos']
    },
    comision: {
        type: Number,
        required: [true, 'La comisión es requerida'],
        min: [0, 'La comisión debe ser mayor o igual a 0'],
        max: [100, 'La comisión debe ser menor o igual a 100']
    },
    codigoEmpleado: {
        type: String,
        required: [true, 'El código de empleado es requerido'],
        unique: true,
        trim: true,
        uppercase: true,
        maxlength: [20, 'El código de empleado no puede exceder 20 caracteres']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vendedor', vendedorSchema);