const request = require('supertest');
const app = require('../src/app.js');
const { _clearConcesionarias } = require('../src/controllers/concesionaria.controller');

let token;

describe('API de Concesionarias', () => {
    // Obtener token antes de los tests
    beforeAll(async () => {
        const loginRes = await request(app).post('/api/auth/login').send({
            email: 'admin@consecionaria.com',
            password: 'consesionariachida'
        });
        token = loginRes.body.token;
    });

    // Limpiar concesionarias antes de cada test
    beforeEach(async () => {
        await _clearConcesionarias();
    });

    // GET
    test('GET /api/concesionarias debería devolver lista vacía inicialmente', async () => {
        const res = await request(app).get('/api/concesionarias').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

  // POST
  test('POST /api/concesionarias debería crear una nueva concesionaria', async () => {
    const nuevaConcesionaria = {
      nombre: 'AutoMax',
      direccion: 'Av. de los Libertadores 500',
      telefono: '022345678',
      ciudad: 'Quito',
      gerente: 'Carlos Mendoza'
    };

    const res = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(nuevaConcesionaria);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('AutoMax');
    expect(res.body.ciudad).toBe('Quito');
    expect(res.body.gerente).toBe('Carlos Mendoza');
  });

  // POST: datos inválidos
  test('POST /api/concesionarias debería rechazar datos incompletos', async () => {
    const res = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send({ nombre: 'AutoPlaza' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Nombre, Dirección, Teléfono, Ciudad y Gerente son requeridos');
  });

  // PUT
  test('PUT /api/concesionarias/:id debería actualizar una concesionaria existente', async () => {
    const concesionaria = {
      nombre: 'VehículosPremium',
      direccion: 'Calle Principal 123',
      telefono: '023456789',
      ciudad: 'Guayaquil',
      gerente: 'María González'
    };

    const creado = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/concesionarias/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ telefono: '029999999' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.telefono).toBe('029999999');
  });

  // DELETE
  test('DELETE /api/concesionarias/:id debería eliminar una concesionaria', async () => {
    const concesionaria = {
      nombre: 'MotorCenter',
      direccion: 'Av. Tercera 789',
      telefono: '024567890',
      ciudad: 'Cuenca',
      gerente: 'Jorge Ramírez'
    };

    const creado = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria);
    const id = creado.body.id;

    const eliminado = await request(app).delete(`/api/concesionarias/${id}`).set('Authorization', `Bearer ${token}`);
    expect(eliminado.statusCode).toBe(200);
    expect(eliminado.body.nombre).toBe('MotorCenter');

    const res = await request(app).get('/api/concesionarias').set('Authorization', `Bearer ${token}`);
    expect(res.body.find(c => c.id === id)).toBeUndefined();
  });

  // EDGE CASE: Actualizar concesionaria que no existe
  test('PUT /api/concesionarias/:id debería retornar 404 si la concesionaria no existe', async () => {
    const idInexistente = 999999;
    const res = await request(app)
      .put(`/api/concesionarias/${idInexistente}`).set('Authorization', `Bearer ${token}`)
      .send({ telefono: '029999999' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Concesionaria no encontrada');
  });

  // EDGE CASE: Eliminar concesionaria que no existe
  test('DELETE /api/concesionarias/:id debería retornar 404 si la concesionaria no existe', async () => {
    const idInexistente = 999999;
    const res = await request(app).delete(`/api/concesionarias/${idInexistente}`).set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Concesionaria no encontrada');
  });

  // INTEGRIDAD DE DATOS: Actualización parcial
  test('PUT /api/concesionarias/:id debería permitir actualización parcial de campos', async () => {
    const concesionaria = {
      nombre: 'AutoElite',
      direccion: 'Av. Central 321',
      telefono: '025678901',
      ciudad: 'Loja',
      gerente: 'Ana Torres'
    };

    const creado = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/concesionarias/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ ciudad: 'Ambato' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.ciudad).toBe('Ambato');
    expect(actualizado.body.nombre).toBe('AutoElite');
    expect(actualizado.body.gerente).toBe('Ana Torres');
  });

  // VALIDACIÓN: Campos con solo espacios
  test('POST /api/concesionarias debería rechazar campos vacíos o con solo espacios', async () => {
    const concesionariaInvalida = {
      nombre: '   ',
      direccion: 'Calle 123',
      telefono: '022345678',
      ciudad: 'Quito',
      gerente: 'Pedro López'
    };

    const res = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionariaInvalida);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Los campos no pueden estar vacíos o contener solo espacios');
  });

  // COBERTURA: Actualizar gerente específicamente
  test('PUT /api/concesionarias/:id debería actualizar el gerente de la concesionaria', async () => {
    const concesionaria = {
      nombre: 'MegaAutos',
      direccion: 'Calle Norte 111',
      telefono: '026789012',
      ciudad: 'Machala',
      gerente: 'Roberto García'
    };

    const creado = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/concesionarias/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ gerente: 'Patricia Morales' });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.gerente).toBe('Patricia Morales');
    expect(actualizado.body.nombre).toBe('MegaAutos');
  });

  // COBERTURA: Actualizar múltiples campos
  test('PUT /api/concesionarias/:id debería actualizar múltiples campos', async () => {
    const concesionaria = {
      nombre: 'SuperAutos',
      direccion: 'Av. Sur 222',
      telefono: '027890123',
      ciudad: 'Esmeraldas',
      gerente: 'Luis Hernández'
    };

    const creado = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/concesionarias/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ 
        direccion: 'Av. Nueva 333',
        ciudad: 'Santo Domingo',
        telefono: '028901234'
      });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.direccion).toBe('Av. Nueva 333');
    expect(actualizado.body.ciudad).toBe('Santo Domingo');
    expect(actualizado.body.telefono).toBe('028901234');
    expect(actualizado.body.nombre).toBe('SuperAutos');
  });

  // COBERTURA: Actualizar nombre
  test('PUT /api/concesionarias/:id debería actualizar el nombre de la concesionaria', async () => {
    const concesionaria = {
      nombre: 'AutosEcuador',
      direccion: 'Calle Vieja 100',
      telefono: '029012345',
      ciudad: 'Ibarra',
      gerente: 'Fernando Silva'
    };

    const creado = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/concesionarias/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ 
        nombre: 'AutosEcuador Premium'
      });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.nombre).toBe('AutosEcuador Premium');
    expect(actualizado.body.gerente).toBe('Fernando Silva');
  });

  // VALIDACIÓN: Nombre duplicado exacto
  test('POST /api/concesionarias debería rechazar nombre duplicado', async () => {
    const concesionaria1 = {
      nombre: 'AutoMax Duplicado',
      direccion: 'Av. Principal 100',
      telefono: '022222222',
      ciudad: 'Quito',
      gerente: 'Gerente 1'
    };

    const concesionaria2 = {
      nombre: 'AutoMax Duplicado',
      direccion: 'Av. Secundaria 200',
      telefono: '023333333',
      ciudad: 'Guayaquil',
      gerente: 'Gerente 2'
    };

    await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria1);
    const res = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria2);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Ya existe una concesionaria con ese nombre');
  });

  // VALIDACIÓN: Nombre duplicado case-insensitive
  test('POST /api/concesionarias debería rechazar nombre duplicado sin importar mayúsculas', async () => {
    const concesionaria1 = {
      nombre: 'MotorPro',
      direccion: 'Av. Principal 100',
      telefono: '022222222',
      ciudad: 'Quito',
      gerente: 'Gerente 1'
    };

    const concesionaria2 = {
      nombre: 'MOTORPRO',
      direccion: 'Av. Secundaria 200',
      telefono: '023333333',
      ciudad: 'Guayaquil',
      gerente: 'Gerente 2'
    };

    await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria1);
    const res = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria2);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Ya existe una concesionaria con ese nombre');
  });

  // VALIDACIÓN: Actualizar con nombre de otra concesionaria
  test('PUT /api/concesionarias/:id debería rechazar nombre duplicado de otra concesionaria', async () => {
    const concesionaria1 = {
      nombre: 'Concesionaria Uno',
      direccion: 'Av. Principal 100',
      telefono: '022222222',
      ciudad: 'Quito',
      gerente: 'Gerente 1'
    };

    const concesionaria2 = {
      nombre: 'Concesionaria Dos',
      direccion: 'Av. Secundaria 200',
      telefono: '023333333',
      ciudad: 'Guayaquil',
      gerente: 'Gerente 2'
    };

    await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria1);
    const creado2 = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria2);
    const id2 = creado2.body.id;

    const actualizado = await request(app)
      .put(`/api/concesionarias/${id2}`).set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Concesionaria Uno' });

    expect(actualizado.statusCode).toBe(400);
    expect(actualizado.body).toHaveProperty('message', 'Ya existe una concesionaria con ese nombre');
  });

  // VALIDACIÓN: Actualizar manteniendo su propio nombre
  test('PUT /api/concesionarias/:id debería permitir actualizar sin cambiar el nombre', async () => {
    const concesionaria = {
      nombre: 'Concesionaria Original',
      direccion: 'Av. Original 100',
      telefono: '022222222',
      ciudad: 'Quito',
      gerente: 'Gerente Original'
    };

    const creado = await request(app).post('/api/concesionarias').set('Authorization', `Bearer ${token}`).send(concesionaria);
    const id = creado.body.id;

    const actualizado = await request(app)
      .put(`/api/concesionarias/${id}`).set('Authorization', `Bearer ${token}`)
      .send({ 
        nombre: 'Concesionaria Original',
        gerente: 'Gerente Modificado'
      });

    expect(actualizado.statusCode).toBe(200);
    expect(actualizado.body.nombre).toBe('Concesionaria Original');
    expect(actualizado.body.gerente).toBe('Gerente Modificado');
  });
});

