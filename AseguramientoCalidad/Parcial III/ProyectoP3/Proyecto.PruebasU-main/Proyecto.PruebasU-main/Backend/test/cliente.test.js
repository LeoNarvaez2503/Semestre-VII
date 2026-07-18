const request = require('supertest');
const app = require('../src/app.js');
const { _clearClientes } = require('../src/controllers/cliente.controller');

let token;

describe('API de Clientes', () => {
    // Obtener token antes de los tests
    beforeAll(async () => {
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com',
            password: 'consesionariachida'
        });
        token = loginRes.body.token;
    });

    // Limpiar clientes antes de cada test
    beforeEach(async () => {
        await _clearClientes();
    });

    // GET
    test('GET /api/clientes debería devolver lista vacía inicialmente', async () => {
        const res = await request(app).get('/api/clientes').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.clientes).toEqual([]);
    });

  // POST
  test('POST /api/clientes debería crear un nuevo cliente', async () => {
    const nuevoCliente = {
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      telefono: '0998765432',
      direccion: 'Av. Principal 123',
      ciudad: 'Quito'
    };

    const res = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(nuevoCliente);

    expect(res.statusCode).toBe(201);
    expect(res.body.cliente).toHaveProperty('id');
    expect(res.body.cliente.nombre).toBe('Juan Pérez');
    expect(res.body.cliente.email).toBe('juan.perez@email.com');
  });

  // POST: datos inválidos
  test('POST /api/clientes debería rechazar datos inválidos', async () => {
    const res = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send({ nombre: 'María' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Nombre, Email, Teléfono, Dirección y Ciudad son requeridos');
  });

  // PUT
  test('PUT /api/clientes/:id debería actualizar un cliente existente', async () => {
    const cliente = {
      nombre: 'Ana López',
      email: 'ana.lopez@email.com',
      telefono: '0987654321',
      direccion: 'Calle Secundaria 456',
      ciudad: 'Guayaquil'
    };

    const creado = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente);
    const id = creado.body.cliente.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ telefono: '0999999999' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.cliente.telefono).toBe('0999999999');
  });

  // DELETE
  test('DELETE /api/clientes/:id debería eliminar un cliente', async () => {
    const cliente = {
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      telefono: '0976543210',
      direccion: 'Av. Tercera 789',
      ciudad: 'Cuenca'
    };

    const creado = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente);
    const id = creado.body.cliente.id;

    const eliminado = await request(app).delete(`/api/clientes/${id}`).set('Authorization', `Bearer ${token}`);
    expect(eliminado.statusCode).toBe(200);
    expect(eliminado.body.cliente.nombre).toBe('Carlos Rodríguez');

    const res = await request(app).get('/api/clientes').set('Authorization', `Bearer ${token}`);
    expect(res.body.clientes.find(c => c.id === id)).toBeUndefined();
  });

  // GET by ID
  test('GET /api/clientes/:id debería obtener un cliente por ID', async () => {
    const cliente = {
      nombre: 'Cliente Test',
      email: 'cliente.test@email.com',
      telefono: '0912345678',
      direccion: 'Calle Test 123',
      ciudad: 'Quito'
    };

    const creado = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente);
    const id = creado.body.cliente.id;

    const res = await request(app).get(`/api/clientes/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.cliente.nombre).toBe('Cliente Test');
  });

  // GET by ID - Cliente no encontrado
  test('GET /api/clientes/:id debería retornar 404 si cliente no existe', async () => {
    const res = await request(app).get('/api/clientes/999999999').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Cliente no encontrado');
  });

  // VALIDACIÓN DE FORMATO: Email inválido
  test('POST /api/clientes debería rechazar email con formato inválido', async () => {
    const clienteEmailInvalido = {
      nombre: 'Pedro Gómez',
      email: 'correo@invalido',
      telefono: '0912345678',
      direccion: 'Calle Falsa 123',
      ciudad: 'Quito'
    };

    const res = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(clienteEmailInvalido);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'El email no tiene un formato válido');
  });

  // EDGE CASE: Actualizar cliente que no existe
  test('PUT /api/clientes/:id debería retornar 404 si el cliente no existe', async () => {
    const idInexistente = 999999;
    const res = await request(app)
      .put(`/api/clientes/${idInexistente}`).set('Authorization', `Bearer ${token}`)
      .send({ telefono: '0999999999' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Cliente no encontrado');
  });

  // EDGE CASE: Eliminar cliente que no existe
  test('DELETE /api/clientes/:id debería retornar 404 si el cliente no existe', async () => {
    const idInexistente = 999999;
    const res = await request(app).delete(`/api/clientes/${idInexistente}`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Cliente no encontrado');
  });

  // INTEGRIDAD DE DATOS: Actualización parcial
  test('PUT /api/clientes/:id debería permitir actualización parcial de campos', async () => {
    const cliente = {
      nombre: 'Sofía Martínez',
      email: 'sofia.martinez@email.com',
      telefono: '0923456789',
      direccion: 'Av. Central 321',
      ciudad: 'Loja'
    };

    const creado = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente);
    const id = creado.body.cliente.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ ciudad: 'Ambato' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.cliente.ciudad).toBe('Ambato');
    expect(actualizado.body.cliente.nombre).toBe('Sofía Martínez');
    expect(actualizado.body.cliente.email).toBe('sofia.martinez@email.com');
  });

  // VALIDACIÓN: Campos con solo espacios
  test('POST /api/clientes debería rechazar campos vacíos o con solo espacios', async () => {
    const clienteInvalido = {
      nombre: '   ',
      email: 'test@email.com',
      telefono: '0912345678',
      direccion: 'Calle 123',
      ciudad: 'Quito'
    };

    const res = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(clienteInvalido);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Nombre, Email, Teléfono, Dirección y Ciudad son requeridos');
  });

  // COBERTURA: Actualizar email específicamente
  test('PUT /api/clientes/:id debería actualizar el email del cliente', async () => {
    const cliente = {
      nombre: 'Roberto García',
      email: 'roberto.garcia@email.com',
      telefono: '0912345678',
      direccion: 'Calle Norte 111',
      ciudad: 'Machala'
    };

    const creado = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente);
    const id = creado.body.cliente.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ email: 'nuevo.email@email.com' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.cliente.email).toBe('nuevo.email@email.com');
    expect(actualizado.body.cliente.nombre).toBe('Roberto García');
  });

  // COBERTURA: Actualizar múltiples campos incluyendo ciudad
  test('PUT /api/clientes/:id debería actualizar múltiples campos incluyendo ciudad', async () => {
    const cliente = {
      nombre: 'Patricia Morales',
      email: 'patricia.morales@email.com',
      telefono: '0998877665',
      direccion: 'Av. Sur 222',
      ciudad: 'Esmeraldas'
    };

    const creado = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente);
    const id = creado.body.cliente.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`).set('Authorization', `Bearer ${token}`)
      .send({
        email: 'patricia.new@email.com',
        ciudad: 'Santo Domingo'
      });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.cliente.email).toBe('patricia.new@email.com');
    expect(actualizado.body.cliente.ciudad).toBe('Santo Domingo');
    expect(actualizado.body.cliente.nombre).toBe('Patricia Morales');
  });

  // COBERTURA: Actualizar todos los campos individualmente
  test('PUT /api/clientes/:id debería actualizar nombre, dirección y ciudad', async () => {
    const cliente = {
      nombre: 'Luis Hernández',
      email: 'luis@email.com',
      telefono: '0987654321',
      direccion: 'Calle Vieja 100',
      ciudad: 'Ibarra'
    };

    const creado = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente);
    const id = creado.body.cliente.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`).set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Luis Fernando Hernández',
        direccion: 'Calle Nueva 200'
      });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.cliente.nombre).toBe('Luis Fernando Hernández');
    expect(actualizado.body.cliente.direccion).toBe('Calle Nueva 200');
  });

  // VALIDACIÓN: Email duplicado exacto
  test('POST /api/clientes debería rechazar email duplicado', async () => {
    const cliente1 = {
      nombre: 'Cliente Uno',
      email: 'duplicado@email.com',
      telefono: '0991111111',
      direccion: 'Calle 1',
      ciudad: 'Quito'
    };

    const cliente2 = {
      nombre: 'Cliente Dos',
      email: 'duplicado@email.com',
      telefono: '0992222222',
      direccion: 'Calle 2',
      ciudad: 'Guayaquil'
    };

    await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente1);
    const res = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente2);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'El email ya está registrado');
  });

  // VALIDACIÓN: Email duplicado case-insensitive
  test('POST /api/clientes debería rechazar email duplicado sin importar mayúsculas', async () => {
    const cliente1 = {
      nombre: 'Cliente Uno',
      email: 'test@email.com',
      telefono: '0991111111',
      direccion: 'Calle 1',
      ciudad: 'Quito'
    };

    const cliente2 = {
      nombre: 'Cliente Dos',
      email: 'TEST@EMAIL.COM',
      telefono: '0992222222',
      direccion: 'Calle 2',
      ciudad: 'Guayaquil'
    };

    await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente1);
    const res = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente2);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'El email ya está registrado');
  });

  // VALIDACIÓN: Actualizar con email de otro cliente
  test('PUT /api/clientes/:id debería rechazar email duplicado de otro cliente', async () => {
    const cliente1 = {
      nombre: 'Cliente Uno',
      email: 'cliente1@email.com',
      telefono: '0991111111',
      direccion: 'Calle 1',
      ciudad: 'Quito'
    };

    const cliente2 = {
      nombre: 'Cliente Dos',
      email: 'cliente2@email.com',
      telefono: '0992222222',
      direccion: 'Calle 2',
      ciudad: 'Guayaquil'
    };

    await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente1);
    const creado2 = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente2);
    const id2 = creado2.body.cliente.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id2}`).set('Authorization', `Bearer ${token}`)
      .send({ email: 'cliente1@email.com' });

    expect(actualizado.statusCode).toBe(400);
    expect(actualizado.body).toHaveProperty('message', 'El email ya está registrado');
  });

  // VALIDACIÓN: Actualizar manteniendo su propio email
  test('PUT /api/clientes/:id debería permitir actualizar sin cambiar el email', async () => {
    const cliente = {
      nombre: 'Cliente Original',
      email: 'original@email.com',
      telefono: '0991111111',
      direccion: 'Calle Original',
      ciudad: 'Quito'
    };

    const creado = await request(app).post('/api/clientes').set('Authorization', `Bearer ${token}`).send(cliente);
    const id = creado.body.cliente.id;

    const actualizado = await request(app)
      .put(`/api/clientes/${id}`).set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Cliente Modificado',
        email: 'original@email.com'
      });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.cliente.nombre).toBe('Cliente Modificado');
    expect(actualizado.body.cliente.email).toBe('original@email.com');
  });
});

