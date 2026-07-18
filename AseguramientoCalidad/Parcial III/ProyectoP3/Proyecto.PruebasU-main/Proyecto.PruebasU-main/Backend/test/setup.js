// Jest setup file
const database = require('../src/config/database');

// Configuración global para todos los tests
beforeAll(async () => {
    // Asegurar conexión a la base de datos antes de ejecutar tests
    try {
        await database.connect();
    } catch (error) {
        console.error('Error conectando a la base de datos en setup:', error);
        throw error;
    }
}, 30000);

// Limpieza global después de todos los tests
afterAll(async () => {
    try {
        await database.disconnect();
    } catch (error) {
        console.error('Error desconectando de la base de datos:', error);
    }
}, 10000);

// Aumentar el timeout por defecto para todos los tests
jest.setTimeout(30000);