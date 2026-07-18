import { login } from './auth_k6.js';
import { testClienteLifecycle } from './cliente_k6_test.js';

const BASE_URL = __ENV.BASE_URL || 'https://proyecto-pruebasu.onrender.com';

export const options = {
    stages: [
        { duration: '10s', target: 5 },
        { duration: '10s', target: 0 },
    ],
};

export default function () {
    const token = login(BASE_URL, 'admin@consecionaria.com', 'consesionariachida');
    if (!token) return;

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    testClienteLifecycle(BASE_URL, params);
}
