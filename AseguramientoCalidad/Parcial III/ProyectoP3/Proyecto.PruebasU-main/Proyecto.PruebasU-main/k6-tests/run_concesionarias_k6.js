import { login } from './auth_k6.js';
import { testConcesionarias } from './concesionarias_k6.js';

const BASE_URL = __ENV.BASE_URL || 'https://proyecto-pruebasu.onrender.com';

export const options = {
    stages: [
        { duration: '5s', target: 5 },
        { duration: '5s', target: 0 },
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

    testConcesionarias(BASE_URL, params);
}
