import http from 'k6/http';
import { check, sleep } from 'k6';

export function testConcesionarias(baseUrl, params) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);

    // Datos de la nueva concesionaria
    const newConcesionaria = {
        nombre: `Concesionaria Test ${timestamp}`,
        direccion: `Av. Siempre Viva ${randomSuffix}`,
        telefono: `099${Math.floor(Math.random() * 10000000)}`, // Max 15 chars
        ciudad: 'Quito',
        gerente: `Gerente ${randomSuffix}`
    };

    // 1. Crear Concesionaria (POST)
    // Asumimos que la ruta es /api/concesionarias based on app.js
    const createRes = http.post(`${baseUrl}/api/concesionarias`, JSON.stringify(newConcesionaria), params);

    const isCreated = check(createRes, {
        'create concesionaria status is 201': (r) => r.status === 201,
        'create concesionaria has id': (r) => r.json('id') !== undefined || r.json('_id') !== undefined,
    });

    if (!isCreated) {
        console.error(`Failed to create concesionaria: ${createRes.status}`);
        console.error(`BODY: ${createRes.body}`);
        return;
    }

    let createdId;
    if (createRes.status === 201) {
        const body = createRes.json();
        createdId = body.id || body._id;
    }
    sleep(1);

    // 2. Obtener todas las concesionarias (GET)
    const getAllRes = http.get(`${baseUrl}/api/concesionarias`, params);
    check(getAllRes, {
        'get all concesionarias status is 200': (r) => r.status === 200,
        'new concesionaria in list': (r) => {
            const body = r.json();
            const list = Array.isArray(body) ? body : body.concesionarias; // Handle potential wrapper
            return Array.isArray(list) && list.some(c => (c.id === createdId || c._id === createdId));
        }
    });
    sleep(1);

    // 3. Obtener concesionaria por ID (GET)
    const getByIdRes = http.get(`${baseUrl}/api/concesionarias/${createdId}`, params);
    check(getByIdRes, {
        'get concesionaria by id status is 200': (r) => r.status === 200,
        'concesionaria id matches': (r) => {
            const body = r.json();
            return (body.id === createdId || body._id === createdId);
        }
    });
    sleep(1);

    // 4. Actualizar concesionaria (PUT)
    const updatePayload = JSON.stringify({
        nombre: `Concesionaria Updated ${timestamp}`,
        ciudad: 'Guayaquil'
    });

    const updateRes = http.put(`${baseUrl}/api/concesionarias/${createdId}`, updatePayload, params);
    check(updateRes, {
        'update concesionaria status is 200': (r) => r.status === 200,
        'concesionaria updated name matches': (r) => r.json('nombre') === `Concesionaria Updated ${timestamp}`,
        'concesionaria updated city matches': (r) => r.json('ciudad') === 'Guayaquil',
    });
    sleep(1);

    // 5. Eliminar concesionaria (DELETE)
    const deleteRes = http.del(`${baseUrl}/api/concesionarias/${createdId}`, null, params);
    check(deleteRes, {
        'delete concesionaria status is 200': (r) => r.status === 200,
    });
    sleep(1);

    // 6. Verificar eliminación (GET debería ser 404)
    const verifyDeleteRes = http.get(`${baseUrl}/api/concesionarias/${createdId}`, params);
    check(verifyDeleteRes, {
        'get deleted concesionaria status is 404': (r) => r.status === 404,
    });
}
