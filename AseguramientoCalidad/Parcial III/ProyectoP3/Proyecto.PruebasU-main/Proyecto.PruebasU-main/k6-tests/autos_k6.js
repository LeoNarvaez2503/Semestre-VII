import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from './libs/uuid.js';

export function testAutoLifecycle(baseUrl, params) {
    const timestamp = Date.now();
    // Using UUID to guarantee uniqueness
    const uniqueId = uuidv4();

    // Datos del nuevo auto
    const newAuto = {
        marca: `Marca Test ${timestamp}`,
        modelo: `Modelo ${uniqueId.substring(0, 8)}`,
        anio: 2024,
        año: 2024,
        color: 'Blanco',
        numeroSerie: `S-${uniqueId.substring(0, 10).toUpperCase()}`
    };

    // 1. Crear Auto (POST)
    const createRes = http.post(`${baseUrl}/api/autos`, JSON.stringify(newAuto), params);

    const isCreated = check(createRes, {
        'create auto status is 201': (r) => r.status === 201,
        'create auto has data.id': (r) => r.json('data.id') !== undefined || r.json('data._id') !== undefined,
    });

    if (!isCreated) {
        console.error(`CREATION FAILED: Status ${createRes.status}`);
        console.error(`BODY: ${createRes.body}`);
        return;
    }

    let createdId;
    if (createRes.status === 201) {
        const body = createRes.json();
        // Controller returns { message: '...', data: savedAuto }
        createdId = body.data ? (body.data.id || body.data._id) : (body.id || body._id);
    }
    sleep(1);

    // 2. Obtener todos los autos (GET)
    const getAllRes = http.get(`${baseUrl}/api/autos`, params);
    check(getAllRes, {
        'get all autos status is 200': (r) => r.status === 200,
        'new auto in list': (r) => {
            const body = r.json();
            return Array.isArray(body) && body.some(a => (a.id === createdId || a._id === createdId));
        }
    });
    sleep(2);

    // 3. Obtener auto por ID (GET)
    const getByIdRes = http.get(`${baseUrl}/api/autos/${createdId}`, params);
    check(getByIdRes, {
        'get auto by id status is 200': (r) => r.status === 200,
        'auto id matches': (r) => {
            const body = r.json();
            return (body.id === createdId || body._id === createdId);
        }
    });
    sleep(1);

    // 4. Actualizar auto (PUT)
    const updatePayload = JSON.stringify({
        color: 'Negro',
        modelo: `Modelo Updated ${timestamp}`
    });

    const updateRes = http.put(`${baseUrl}/api/autos/${createdId}`, updatePayload, params);
    check(updateRes, {
        'update auto status is 200': (r) => r.status === 200,
        'auto updated color matches': (r) => r.json('data.color') === 'Negro',
    });
    sleep(1);

    // 5. Eliminar auto (DELETE)
    const deleteRes = http.del(`${baseUrl}/api/autos/${createdId}`, null, params);
    check(deleteRes, {
        'delete auto status is 200': (r) => r.status === 200,
    });
    sleep(1);

    // 6. Verificar eliminación (GET debería ser 404)
    const verifyDeleteRes = http.get(`${baseUrl}/api/autos/${createdId}`, params);
    check(verifyDeleteRes, {
        'get deleted auto status is 404': (r) => r.status === 404,
    });
}
