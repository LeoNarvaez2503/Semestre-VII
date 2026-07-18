require('dotenv').config();
const database = require('./config/database');
const { Auto, Cliente, Vendedor, Concesionaria, Usuario } = require('./models');

// Datos iniciales para desarrollo y testing
const seedData = {
    autos: [
        { marca: 'Toyota', modelo: 'Corolla', año: 2023, color: 'Blanco', numeroSerie: 'TOY001' },
        { marca: 'Honda', modelo: 'Civic', año: 2024, color: 'Negro', numeroSerie: 'HON001' }
    ],
    clientes: [
        { nombre: 'Carlos Rodriguez', email: 'carlos@cliente.com', telefono: '5551234567', direccion: 'Calle 123', ciudad: 'Quito' },
        { nombre: 'Ana Martinez', email: 'ana@cliente.com', telefono: '5559876543', direccion: 'Av Principal 456', ciudad: 'Guayaquil' }
    ],
    vendedores: [
        { name: 'Juan Perez', email: 'juan@empresa.com', telefono: '1234567890', comision: 5, codigoEmpleado: 'EMP001' },
        { name: 'Maria Lopez', email: 'maria@empresa.com', telefono: '0987654321', comision: 7, codigoEmpleado: 'EMP002' }
    ],
    concesionarias: [
        { nombre: 'AutoVentas Central', direccion: 'Av. Amazonas 123', telefono: '0987654321', ciudad: 'Quito', gerente: 'Roberto Silva' },
        { nombre: 'Autos del Pacifico', direccion: 'Malecón 456', telefono: '0912345678', ciudad: 'Guayaquil', gerente: 'Patricia Ruiz' }
    ],
    usuarios: [
        { nombre: 'Administrador', email: 'admin@consecionaria.com', password: 'consesionariachida' }
    ]
};

// Clear all collections
async function clearCollections() {
    await Promise.all([
        Auto.deleteMany({}),
        Cliente.deleteMany({}),
        Vendedor.deleteMany({}),
        Concesionaria.deleteMany({}),
        Usuario.deleteMany({})
    ]);
}

// Insert seed data
async function insertSeedData() {
    await Promise.all([
        Auto.insertMany(seedData.autos),
        Cliente.insertMany(seedData.clientes),
        Vendedor.insertMany(seedData.vendedores),
        Concesionaria.insertMany(seedData.concesionarias),
        Usuario.insertMany(seedData.usuarios)
    ]);
}

async function seedDatabase() {
    try {
        // Starting database seeding
        await database.connect();
        await clearCollections();
        await insertSeedData();
        // Database seeded successfully
        
        await database.disconnect();
        process.exit(0);
    } catch (_error) {
        // Error during database seeding
        _error.message = 'Error seeding database: ' + _error.message;
        await database.disconnect();
        process.exit(1);
    }
}

// Solo ejecutar si se llama directamente
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase, seedData };