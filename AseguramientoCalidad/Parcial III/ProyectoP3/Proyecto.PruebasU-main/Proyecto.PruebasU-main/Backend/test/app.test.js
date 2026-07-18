const request = require('supertest');
const app = require('../src/app.js');

let token;

// Importar todos los tests de las entidades
require('./auto.test.js');
require('./cliente.test.js');
require('./vendor.test.js');
require('./concesionaria.test.js');

describe('Pruebas sobre app.js (rutas y middleware)', () => {
    // Obtener token antes de los tests
    beforeAll(async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'admin@consecionaria.com',
        password: 'consesionariachida'
      });
      token = loginRes.body.token;
    });

    test('GET / debe devolver mensaje de estado', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
    });

    test('CORS preflight: OPTIONS /autos responde 200', async () => {
        const res = await request(app)
            .options('/autos')
            .set('Origin', 'http://example.com')
            .set('Access-Control-Request-Method', 'GET');
        expect(res.statusCode).toBe(200);
    });

    test('GET /autos debe responder 200 y contener cabeceras CORS', async () => {
        const res = await request(app)
            .get('/autos')
            .set('Origin', 'http://example.com')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.headers['access-control-allow-origin']).toBe('*');
        expect(res.headers['access-control-allow-methods']).toBeDefined();
    });

    test('GET /api/autos debe comportarse igual que /autos', async () => {
        const r1 = await request(app).get('/api/autos').set('Authorization', `Bearer ${token}`);
        const r2 = await request(app).get('/autos').set('Authorization', `Bearer ${token}`);
        expect(r1.statusCode).toBe(200);
        expect(r2.statusCode).toBe(200);
        expect(Array.isArray(r1.body)).toBe(true);
        expect(Array.isArray(r2.body)).toBe(true);
    });

    test('Ruta inexistente debe devolver 404 con mensaje "Endpoint no encontrado"', async () => {
        const res = await request(app).get('/ruta-que-no-existe-para-tests');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Endpoint no encontrado');
    });
});
