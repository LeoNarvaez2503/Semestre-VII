import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from './libs/uuid.js';

export function testClienteLifecycle(baseUrl, params) {
    const timestamp = Date.now();
    const uniqueId = uuidv4();

    // Datos del nuevo cliente (coinciden con el modelo)
    const newClient = {
        nombre: `Cliente Test ${timestamp}`,
        email: `test.client.${uniqueId}@example.com`,
        telefono: `09${Math.floor(Math.random() * 100000000)}`,
        direccion: `Calle Falsa ${uniqueId.substring(0, 5)}`,
        ciudad: 'Quito'
    };

    // 1. Crear Cliente (POST)
    const createRes = http.post(`${baseUrl}/api/clientes`, JSON.stringify(newClient), params);

    const checkId = check(createRes, {
        'create client status is 201': (r) => r.status === 201,
        'create client has id': (r) => r.json('cliente.id') !== undefined || r.json('cliente._id') !== undefined,
    });

    if (!checkId || createRes.status !== 201) {
        console.error(`Create Client Failed. Status: ${createRes.status}. Body: ${createRes.body}`);
        return;
    }

    let createdId;
    if (createRes.status === 201) {
        const body = createRes.json();
        // Controller returns { message: '...', cliente: savedCliente }
        createdId = body.cliente ? (body.cliente.id || body.cliente._id) : (body.id || body._id);
    }
    sleep(1);

    // 2. Obtener todos los clientes (GET)
    const getAllRes = http.get(`${baseUrl}/api/clientes`, params);
    check(getAllRes, {
        'get all clients status is 200': (r) => r.status === 200,
        'new client in list': (r) => {
            const body = r.json();
            // El backend puede devolver { clientes: [...] } o [...] directamente
            let list = body.clientes || body;
            return Array.isArray(list) && list.some(c => (c.id === createdId || c._id === createdId));
        }
    });
    sleep(1);

    // 3. Obtener cliente por ID (GET)
    const getByIdRes = http.get(`${baseUrl}/api/clientes/${createdId}`, params);
    check(getByIdRes, {
        'get client by id status is 200': (r) => r.status === 200,
        'client id matches': (r) => {
            if (r.status !== 200) return false;
            const body = r.json();
            const clientData = body.cliente || body; // Handle wrapped or unwrapped
            const match = (clientData.id == createdId || clientData._id == createdId);
            if (!match) console.log(`ID Mismatch: Expected ${createdId}, Got ${clientData.id || clientData._id}. Body: ${JSON.stringify(body)}`);
            return match;
        }
    });
    sleep(2); // Aumentar espera a 2s

    // 4. Actualizar cliente (PUT)
    const updatePayload = JSON.stringify({
        nombre: `Cliente Updated ${timestamp}`,
        ciudad: 'Guayaquil'
    });

    const updateRes = http.put(`${baseUrl}/api/clientes/${createdId}`, updatePayload, params);
    check(updateRes, {
        'update client status is 200': (r) => r.status === 200,
        'client updated name matches': (r) => r.json('cliente.nombre') === `Cliente Updated ${timestamp}`,
        'client updated city matches': (r) => r.json('cliente.ciudad') === 'Guayaquil',
    });
    sleep(1);

    // 5. Eliminar cliente (DELETE)
    const deleteRes = http.del(`${baseUrl}/api/clientes/${createdId}`, null, params);
    check(deleteRes, {
        'delete client status is 200': (r) => r.status === 200,
    });
    sleep(1);

    // 6. Verificar eliminación (GET debería ser 404)
    const verifyDeleteRes = http.get(`${baseUrl}/api/clientes/${createdId}`, params);
    check(verifyDeleteRes, {
        'get deleted client status is 404': (r) => r.status === 404,
    });
}
