const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    }
}, {
    timestamps: true
});

// Hash password antes de guardar
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to check password
usuarioSchema.methods.checkPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);