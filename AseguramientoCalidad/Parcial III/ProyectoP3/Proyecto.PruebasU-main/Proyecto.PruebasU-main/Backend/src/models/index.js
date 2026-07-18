// Exportación centralizada de todos los modelos
const Auto = require('./Auto');
const Cliente = require('./Cliente');
const Vendedor = require('./Vendedor');
const Concesionaria = require('./Concesionaria');
const Usuario = require('./Usuario');

module.exports = {
    Auto,
    Cliente,
    Vendedor,
    Concesionaria,
    Usuario
};