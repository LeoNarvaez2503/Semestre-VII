const request = require('supertest');
const app = require('../src/app');
const { _clearVendedores } = require('../src/controllers/vendor.controller');

let newVendorId;
let putVendorId;
let token;

describe('API CRUD de Vendedores (/api/vendedores)', () => {

  const validVendor = {
    name: 'Ana García',
    email: 'ana.garcia@concesionaria.com',
    telefono: '0987654321',
    comision: 20,
    codigoEmpleado: 'EMP-123'
  };

  // Obtener token antes de los tests
  beforeAll(async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@consecionaria.com',
      password: 'consesionariachida'
    });
    token = loginRes.body.token;
  });

  // Limpiar vendedores antes de cada test
  beforeEach(async () => {
    await _clearVendedores();
  });

  // 1. POST creación válida
  test('POST / -> debe crear un nuevo vendedor', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .set('Authorization', `Bearer ${token}`)
      .send(validVendor);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(validVendor.name);

    newVendorId = res.body.id;
  });

  // 2. GET por ID
  test('GET /:id -> debe obtener un vendedor por su ID', async () => {
    const res = await request(app).get(`/api/vendedores/${newVendorId}`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(newVendorId);
  });

  // 3. GET ALL
  test('GET / -> debe obtener todos los vendedores', async () => {
    const res = await request(app).get('/api/vendedores').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 4. PUT actualización válida
  test('PUT /:id -> debe actualizar un vendedor', async () => {
    const updatedData = {
      name: 'Ana G. Actualizada',
      codigoEmpleado: 'EMP-999'
    };

    const res = await request(app)
      .put(`/api/vendedores/${newVendorId}`).set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.codigoEmpleado).toBe(updatedData.codigoEmpleado);
  });

  // 5. DELETE eliminación válida
  test('DELETE /:id -> debe eliminar un vendedor', async () => {
    const res = await request(app).delete(`/api/vendedores/${newVendorId}`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Vendedor eliminado exitosamente');
  });

  // 6. GET tras DELETE
  test('GET /:id -> debe devolver 404 si el vendedor fue eliminado', async () => {
    const res = await request(app).get(`/api/vendedores/${newVendorId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  // 7. GET ID inexistente
  test('GET /:id -> debe devolver 404 para un ID inexistente', async () => {
    const res = await request(app).get('/api/vendedores/999999').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  // 8. POST Validación: falta el campo name
  test('POST / -> debe fallar si falta name', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        email: "x@test.com",
        telefono: "1234567",
        comision: 10,
        codigoEmpleado: 'EMP-124'
      });

    expect(res.statusCode).toBe(400);
  });

  // 9. POST Validación: falta el campo email
  test('POST / -> debe fallar si falta email', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Mario",
        telefono: "1234567",
        comision: 10,
        codigoEmpleado: 'EMP-125'
      });

    expect(res.statusCode).toBe(400);
  });

  // 10. POST Validación: falta el campo teléfono
  test('POST / -> debe fallar si falta telefono', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Mario",
        email: "mario@test.com",
        comision: 10,
        codigoEmpleado: 'EMP-128'
      });

    expect(res.statusCode).toBe(400);
  });

  // 11. POST Validación: falta el campo comisión
  test('POST / -> debe fallar si falta comision', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Mario",
        email: "mario@test.com",
        telefono: "1234567",
        codigoEmpleado: 'EMP-129'
      });

    expect(res.statusCode).toBe(400);
  });

  // 12. POST Validación email inválido
  test('POST / -> email inválido debe fallar', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Pedro",
        email: "correo_malo.com",
        telefono: "1234567",
        comision: 15,
        codigoEmpleado: 'EMP-130'
      });
    expect(res.statusCode).toBe(400);
  });

  // 13. POST Validación teléfono inválido
  test('POST / -> teléfono inválido debe fallar', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Pedro",
        email: "pedro@test.com",
        telefono: "12abc",
        comision: 10,
        codigoEmpleado: 'EMP-150',
      });

    expect(res.statusCode).toBe(400);
  });

  // 14. POST Validación teléfono muy corto
  test('POST / -> teléfono demasiado corto debe fallar', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Carlos",
        email: "c@test.com",
        telefono: "123",
        comision: 10,
        codigoEmpleado: 'EMP-130'
      });

    expect(res.statusCode).toBe(400);
  });

  // 15. POST Validación comision fuera de rango
  test('POST / -> comisión fuera de 0-100 debe fallar', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Luis",
        email: "l@test.com",
        telefono: "1234567",
        comision: 150,
        codigoEmpleado: 'EMP-129',
      });

    expect(res.statusCode).toBe(400);
  });

  // 16. POST Validación email duplicado
  test('POST / -> email duplicado debe fallar', async () => {
    await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Repetido",
        email: "dup@test.com",
        telefono: "1234567",
        comision: 10,
        codigoEmpleado: 'EMP-1000'
      });

    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Repetido2",
        email: "dup@test.com",
        telefono: "1234567",
        comision: 10,
        codigoEmpleado: 'EMP-2000'
      });

    expect(res.statusCode).toBe(409);
  });
  
  // 17. PUT -> vendedor no existe
  test('PUT /:id -> debe devolver 404 si el vendedor no existe', async () => {
    const res = await request(app)
      .put('/api/vendedores/999999').set('Authorization', `Bearer ${token}`)
      .send({ name: "Nuevo nombre" });

    expect(res.statusCode).toBe(404);
  });

  test('POST / -> crear vendedor para pruebas PUT adicionales', async () => {
    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "PUT Tester",
        email: "put@test.com",
        telefono: "1234567",
        comision: 10,
        codigoEmpleado: "EMP-PUT"
      });

    expect(res.statusCode).toBe(201);
    putVendorId = res.body.id;
  });

  // 18. PUT -> email inválido
  test('PUT /:id -> debe fallar si el email es inválido', async () => {
    const res = await request(app)
      .put(`/api/vendedores/${putVendorId}`).set('Authorization', `Bearer ${token}`)
      .send({ email: "correo_malo" });

    expect(res.statusCode).toBe(400);
  });

  // 19. PUT -> teléfono inválido
  test('PUT /:id -> debe fallar si el teléfono es inválido', async () => {
    const res = await request(app)
      .put(`/api/vendedores/${putVendorId}`).set('Authorization', `Bearer ${token}`)
      .send({ telefono: "12ab" });

    expect(res.statusCode).toBe(400);
  });

  // 20. PUT -> comisión inválida
  test('PUT /:id -> debe fallar si la comisión es inválida', async () => {
    const res = await request(app)
      .put(`/api/vendedores/${putVendorId}`).set('Authorization', `Bearer ${token}`)
      .send({ comision: 200 });

    expect(res.statusCode).toBe(400);
  });

  // 21. PUT -> email duplicado
  test('PUT /:id -> debe fallar si el email ya pertenece a otro vendedor', async () => {
    await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Duplicado PUT",
        email: "duplicado@test.com",
        telefono: "1234567",
        comision: 10,
        codigoEmpleado: 'EMP-147'
      });

    const res = await request(app)
      .put(`/api/vendedores/${putVendorId}`).set('Authorization', `Bearer ${token}`)
      .send({ email: "duplicado@test.com" });

    expect(res.statusCode).toBe(409);
  });

  // 22. DELETE -> vendedor no existe
  test('DELETE /:id -> debe devolver 404 si el vendedor no existe', async () => {
    const res = await request(app).delete('/api/vendedores/999999').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  // 23. GET ALL -> debe devolver arreglo vacío si no hay vendedores
  test('GET / -> si no hay vendedores debe devolver []', async () => {
    const all = await request(app).get('/api/vendedores').set('Authorization', `Bearer ${token}`);

    for (const v of all.body) {
      await request(app).delete(`/api/vendedores/${v.id}`).set('Authorization', `Bearer ${token}`);
    }

    const res = await request(app).get('/api/vendedores').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  // 24. PUT -> si no se envía name, se mantiene el anterior
  test('PUT /:id -> si no se envía name debe mantenerse el existente', async () => {
    const resCreate = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Nombre Original",
        email: "no-name@test.com",
        telefono: "1234567",
        comision: 10,
        codigoEmpleado: "EMP-ORIG"
      });

    const vid = resCreate.body.id;

    const resUpdate = await request(app)
      .put(`/api/vendedores/${vid}`).set('Authorization', `Bearer ${token}`)
      .send({
        codigoEmpleado: "EMP-NEW"
      });

    expect(resUpdate.statusCode).toBe(200);
    expect(resUpdate.body.name).toBe("Nombre Original");
    expect(resUpdate.body.codigoEmpleado).toBe("EMP-NEW");
  });

  // 25. PUT -> si no se envía codigoEmpleado mantiene el anterior
  test('PUT /:id -> si no se envía codigoEmpleado debe mantenerse el existente', async () => {
    const resCreate = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Para Codigo",
        email: "no-code@test.com",
        telefono: "1234567",
        comision: 10,
        codigoEmpleado: "EMP-345"
      });

    const vid = resCreate.body.id;

    const resUpdate = await request(app)
      .put(`/api/vendedores/${vid}`).set('Authorization', `Bearer ${token}`)
      .send({
        name: "Nuevo Nombre"
      });

    expect(resUpdate.statusCode).toBe(200);
    expect(resUpdate.body.codigoEmpleado).toBe("EMP-345");
    expect(resUpdate.body.name).toBe("Nuevo Nombre");
  });

  test('POST / -> códigoEmpleado duplicado debe fallar', async () => {
    await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Pedro",
        email: "pedro@test.com",
        telefono: "12345678",
        comision: 10,
        codigoEmpleado: "EMP-100"
      });

    const res = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Juan",
        email: "juan@test.com",
        telefono: "87654321",
        comision: 20,
        codigoEmpleado: "EMP-100"
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('El código de empleado ya está registrado');
  });

  test('PUT /:id -> debe fallar si el códigoEmpleado ya pertenece a otro vendedor', async () => {

    const v1 = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Luis",
        email: "luis@test.com",
        telefono: "11111111",
        comision: 15,
        codigoEmpleado: "EMP-200"
      });

    const v2 = await request(app)
      .post('/api/vendedores').set('Authorization', `Bearer ${token}`)
      .send({
        name: "Mario",
        email: "mario@test.com",
        telefono: "22222222",
        comision: 20,
        codigoEmpleado: "EMP-300"
      });

    const res = await request(app)
      .put(`/api/vendedores/${v2.body.id}`).set('Authorization', `Bearer ${token}`)
      .send({
        codigoEmpleado: "EMP-200" 
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('El código de empleado ya está registrado');
  });
});

