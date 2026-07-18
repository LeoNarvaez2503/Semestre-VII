const request = require('supertest');
const app = require('../src/app.js');
const { _clearAutos } = require('../src/controllers/auto.controller');

describe('API de Autenticación', () => {
    let token = null;

    // Limpiar autos antes de cada test
    beforeEach(() => {
        _clearAutos();
    });

    // POST - Login exitoso
    test('POST /api/auth/login debería retornar token con credenciales válidas', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com',
            password: 'consesionariachida'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe('admin@consecionaria.com');
    
        // Guardar token para pruebas posteriores
        token = res.body.token;
    });

    // POST - Email inválido
    test('POST /api/auth/login debería rechazar email inválido', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'usuario@inválido.com',
            password: 'consesionariachida'
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('msg');
    });

    // POST - Contraseña inválida
    test('POST /api/auth/login debería rechazar contraseña inválida', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com',
            password: 'contraseña_incorrecta'
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('msg');
    });

    // POST - Campos faltantes
    test('POST /api/auth/login debería rechazar sin email', async () => {
        const res = await request(app).post('/api/auth/login').send({
            password: 'consesionariachida'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('msg');
    });

    // POST - Sin contraseña
    test('POST /api/auth/login debería rechazar sin contraseña', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com'
        });

        expect(res.statusCode).toBe(400);
    });

    // GET - Profile sin token
    test('GET /api/auth/profile debería retornar 401 sin token', async () => {
        const res = await request(app).get('/api/auth/profile');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('msg');
    });

    // GET - Profile con token inválido
    test('GET /api/auth/profile debería retornar 403 con token inválido', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', 'Bearer token_inválido');

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('msg');
    });

    // GET - Profile con token válido
    test('GET /api/auth/profile debería retornar datos del usuario con token válido', async () => {
        // Primero hacer login para obtener token
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com',
            password: 'consesionariachida'
        });

        const validToken = loginRes.body.token;

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email');
        expect(res.body.email).toBe('admin@consecionaria.com');
    });

    // Protección de rutas - GET /api/autos sin token
    test('GET /api/autos debería retornar 401 sin token', async () => {
        const res = await request(app).get('/api/autos');

        expect(res.statusCode).toBe(401);
    });

    // Protección de rutas - GET /api/autos con token válido
    test('GET /api/autos debería retornar lista con token válido', async () => {
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com',
            password: 'consesionariachida'
        });

        const validToken = loginRes.body.token;

        const res = await request(app)
            .get('/api/autos')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // POST /api/autos sin token
    test('POST /api/autos debería retornar 401 sin token', async () => {
        const res = await request(app).post('/api/autos').send({
            marca: 'Toyota',
            modelo: 'Corolla',
            año: 2023,
            color: 'Blanco',
            numeroSerie: 'TOYOTA001'
        });

        expect(res.statusCode).toBe(401);
    });

    // POST /api/autos con token válido
    test('POST /api/autos debería crear auto con token válido', async () => {
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com',
            password: 'consesionariachida'
        });

        const validToken = loginRes.body.token;

        const res = await request(app)
            .post('/api/autos')
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                marca: 'Honda',
                modelo: 'Civic',
                año: 2023,
                color: 'Negro',
                numeroSerie: 'HONDA_AUTH_TEST'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data.marca).toBe('Honda');
    });
});
