const mongoose = require('mongoose');

const autoSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: [true, 'La marca es requerida'],
        trim: true,
        maxlength: [50, 'La marca no puede exceder 50 caracteres']
    },
    modelo: {
        type: String,
        required: [true, 'El modelo es requerido'],
        trim: true,
        maxlength: [50, 'El modelo no puede exceder 50 caracteres']
    },
    año: {
        type: Number,
        required: [true, 'El año es requerido'],
        min: [1900, 'El año debe ser mayor a 1900'],
        max: [new Date().getFullYear() + 1, 'El año no puede ser mayor al año siguiente']
    },
    color: {
        type: String,
        required: [true, 'El color es requerido'],
        trim: true,
        maxlength: [30, 'El color no puede exceder 30 caracteres']
    },
    numeroSerie: {
        type: String,
        required: [true, 'El número de serie es requerido'],
        unique: true,
        trim: true,
        uppercase: true,
        maxlength: [20, 'El número de serie no puede exceder 20 caracteres']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Auto', autoSchema);