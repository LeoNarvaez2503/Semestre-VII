const request = require('supertest');
const app = require('../src/app.js');
const { _clearAutos } = require('../src/controllers/auto.controller');

let token;

describe('API de Autos', () => {
    // Obtener token antes de los tests
    beforeAll(async () => {
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com',
            password: 'consesionariachida'
        });
        token = loginRes.body.token;
    });

    // Limpiar autos antes de cada test
    beforeEach(async () => {
        await _clearAutos();
    });

    // GET - Obtener lista de autos
    test('GET /autos debería devolver lista vacía al inicio', async () => {
        const res = await request(app).get('/autos').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // POST - Crear auto válido
    test('POST /autos debería crear un nuevo auto', async () => {
        const nuevoAuto = {
            marca: 'Toyota',
            modelo: 'Corolla',
            año: 2023,
            color: 'Blanco',
            numeroSerie: 'TOYOTA001'
        };

        const res = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(nuevoAuto);

        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.marca).toBe('Toyota');
        expect(res.body.data.numeroSerie).toBe('TOYOTA001');
    });

    // POST - Validar campos obligatorios
    test('POST /autos debería rechazar auto sin marca', async () => {
        const res = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send({
            modelo: 'Corolla',
            año: 2023,
            color: 'Blanco',
            numeroSerie: 'SERIE001'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    // POST - Validar año válido
    test('POST /autos debería rechazar año inválido', async () => {
        const res = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send({
            marca: 'Toyota',
            modelo: 'Corolla',
            año: 1800,
            color: 'Blanco',
            numeroSerie: 'INVALID_YEAR'
        });
        expect(res.statusCode).toBe(400);
    });

    // POST - Validar número de serie único
    test('POST /autos debería rechazar número de serie duplicado', async () => {
        const auto = {
            marca: 'Honda',
            modelo: 'Civic',
            año: 2023,
            color: 'Negro',
            numeroSerie: 'UNIQUE123'
        };

        await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto);
    
        const res = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto);
        expect(res.statusCode).toBe(400);
    });

    // PUT - Actualizar campo específico
    test('PUT /autos/:id debería actualizar un campo del auto', async () => {
        const auto = {
            marca: 'Ford',
            modelo: 'Mustang',
            año: 2022,
            color: 'Rojo',
            numeroSerie: 'FORD001'
        };

        const creado = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto);
        const id = creado.body.data.id;

        const res = await request(app)
            .put(`/autos/${id}`).set('Authorization', `Bearer ${token}`)
            .send({ color: 'Azul' });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.color).toBe('Azul');
        expect(res.body.data.modelo).toBe('Mustang');
    });

    // PUT - Actualizar todos los campos
    test('PUT /autos/:id debería actualizar todos los campos', async () => {
        const auto = {
            marca: 'BMW',
            modelo: '3 Series',
            año: 2020,
            color: 'Gris',
            numeroSerie: 'BMW001'
        };

        const creado = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto);
        const id = creado.body.data.id;

        const cambios = {
            marca: 'Mercedes',
            modelo: 'C-Class',
            año: 2024,
            color: 'Negro',
            numeroSerie: 'MERC001'
        };

        const res = await request(app).put(`/autos/${id}`).set('Authorization', `Bearer ${token}`).send(cambios);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.marca).toBe('Mercedes');
        expect(res.body.data.año).toBe(2024);
    });

    // PUT - Validar año en actualización
    test('PUT /autos/:id debería rechazar año inválido en actualización', async () => {
        const auto = {
            marca: 'Nissan',
            modelo: 'Sentra',
            año: 2021,
            color: 'Blanco',
            numeroSerie: 'NISS001'
        };

        const creado = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto);
        const id = creado.body.data.id;

        const res = await request(app)
            .put(`/autos/${id}`).set('Authorization', `Bearer ${token}`)
            .send({ año: 1800 });

        expect(res.statusCode).toBe(400);
    });

    // PUT - Auto no encontrado
    test('PUT /autos/:id debería retornar 404 si auto no existe', async () => {
        const res = await request(app)
            .put('/autos/999999999').set('Authorization', `Bearer ${token}`)
            .send({ color: 'Verde' });

        expect(res.statusCode).toBe(404);
    });

    // DELETE - Eliminar auto exitosamente
    test('DELETE /autos/:id debería eliminar un auto', async () => {
        const auto = {
            marca: 'Volkswagen',
            modelo: 'Golf',
            año: 2023,
            color: 'Plata',
            numeroSerie: 'VW001'
        };

        const creado = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto);
        const id = creado.body.data.id;

        const eliminado = await request(app).delete(`/autos/${id}`).set('Authorization', `Bearer ${token}`);
        expect(eliminado.statusCode).toBe(200);
        expect(eliminado.body.data.marca).toBe('Volkswagen');

        const res = await request(app).get('/autos').set('Authorization', `Bearer ${token}`);
        expect(res.body.find(a => a.id === id)).toBeUndefined();
    });

    // DELETE - Auto no encontrado
    test('DELETE /autos/:id debería retornar 404 si auto no existe', async () => {
        const res = await request(app).delete('/autos/999999999').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    });

    // GET by ID - Obtener auto por ID
    test('GET /autos/:id debería obtener un auto por ID', async () => {
        const auto = {
            marca: 'Chevrolet',
            modelo: 'Camaro',
            año: 2023,
            color: 'Amarillo',
            numeroSerie: 'CHEV001'
        };

        const creado = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto);
        const id = creado.body.data.id;

        const res = await request(app).get(`/autos/${id}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.marca).toBe('Chevrolet');
    });

    // GET by ID - Auto no encontrado
    test('GET /autos/:id debería retornar 404 si auto no existe', async () => {
        const res = await request(app).get('/autos/999999999').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    });

    // PUT - Validar número de serie duplicado en actualización
    test('PUT /autos/:id debería rechazar número de serie duplicado', async () => {
        const auto1 = { marca: 'Audi', modelo: 'A4', año: 2022, color: 'Negro', numeroSerie: 'AUDI001' };
        const auto2 = { marca: 'Audi', modelo: 'A6', año: 2023, color: 'Blanco', numeroSerie: 'AUDI002' };

        await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto1);
        const creado2 = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto2);
        const id2 = creado2.body.data.id;

        const res = await request(app)
            .put(`/autos/${id2}`).set('Authorization', `Bearer ${token}`)
            .send({ numeroSerie: 'AUDI001' });

        expect(res.statusCode).toBe(400);
    });

    // PUT - Actualizar solo marca y modelo (sin color)
    test('PUT /autos/:id debería actualizar solo marca y modelo', async () => {
        const auto = { marca: 'Mazda', modelo: 'CX-5', año: 2023, color: 'Rojo', numeroSerie: 'MAZDA001' };

        const creado = await request(app).post('/autos').set('Authorization', `Bearer ${token}`).send(auto);
        const id = creado.body.data.id;

        const res = await request(app)
            .put(`/autos/${id}`).set('Authorization', `Bearer ${token}`)
            .send({ marca: 'Mazda Updated', modelo: 'CX-9' });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.marca).toBe('Mazda Updated');
        expect(res.body.data.modelo).toBe('CX-9');
        expect(res.body.data.color).toBe('Rojo'); // Color no cambia
    });
});