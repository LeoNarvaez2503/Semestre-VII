import { login } from './auth_k6.js';
import { testAutoLifecycle } from './autos_k6.js';

const BASE_URL = __ENV.BASE_URL || 'https://proyecto-pruebasu.onrender.com';

export const options = {
    stages: [
        { duration: '10s', target: 5 },   // ramp up a 5 usuarios
        { duration: '20s', target: 10 },   // sube a 10 usuarios
        { duration: '10s', target: 0 },    // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // 95% de requests < 500ms
        checks: ['rate>0.95'],             // 95% de checks deben pasar
    },
};

export default function () {
    // 1. Login para obtener token
    const token = login(BASE_URL, 'admin@consecionaria.com', 'consesionariachida');
    if (!token) return;

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    // 2. Ejecutar ciclo CRUD completo de autos
    testAutoLifecycle(BASE_URL, params);
}
