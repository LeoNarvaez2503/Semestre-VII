import { sleep, group } from 'k6';
import { testVendorLifecycle } from './vendor_k6_test.js';
import { testClienteLifecycle } from './cliente_k6_test.js';
import { login } from './auth_k6.js';
import { testAutoLifecycle } from './autos_k6.js';
import { testConcesionarias } from './concesionarias_k6.js';

const BASE_URL = __ENV.BASE_URL || 'https://proyecto-pruebasu.onrender.com';

export const options = {
    stages: [
        { duration: '20s', target: 5 },
        { duration: '40s', target: 5 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<30000'],
        http_req_failed: ['rate<0.35'],
    },
};

export default function () {
    const token = login(BASE_URL, 'admin@consecionaria.com', 'consesionariachida');

    if (!token) {
        return;
    }

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    group('API Endpoints', function () {
        // 2. Obtener Autos
        testAutoLifecycle(BASE_URL, { headers: authHeaders });
        sleep(1);

        // 3. Ciclo de vida Vendedores (CRUD)
        group('Vendedores Lifecycle', function () {
            testVendorLifecycle(BASE_URL, { headers: authHeaders });
        });
        sleep(1);

        // 4. Ciclo de vida Clientes (CRUD)
        group('Clientes Lifecycle', function () {
            testClienteLifecycle(BASE_URL, { headers: authHeaders });
        });
        sleep(1);

        // 5. Obtener Concesionarias
        testConcesionarias(BASE_URL, { headers: authHeaders });
        sleep(1);
    });
}
