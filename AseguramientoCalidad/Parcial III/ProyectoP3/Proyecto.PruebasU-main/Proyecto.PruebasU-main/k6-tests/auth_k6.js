import http from 'k6/http';
import { check, sleep } from 'k6';

export function login(baseUrl, email, password) {
    const loginPayload = JSON.stringify({
        email: email,
        password: password,
    });

    const headers = { 'Content-Type': 'application/json' };
    const loginRes = http.post(`${baseUrl}/api/auth/login`, loginPayload, { headers: headers });

    // Verificar login
    const isLoginSuccessful = check(loginRes, {
        'login status is 200': (r) => r.status === 200,
        'login token present': (r) => r.json('token') !== undefined,
    });

    if (!isLoginSuccessful) {
        console.error(`Login failed: ${loginRes.status} ${loginRes.body}`);
        return null;
    }

    return loginRes.json('token');
}

export function testAuthLifecycle(baseUrl) {
    const headers = { 'Content-Type': 'application/json' };

    // 1. Login exitoso
    const loginRes = http.post(`${baseUrl}/api/auth/login`, JSON.stringify({
        email: 'admin@consecionaria.com',
        password: 'consesionariachida'
    }), { headers });

    check(loginRes, {
        'login exitoso status 200': (r) => r.status === 200,
        'login retorna token': (r) => r.json('token') !== undefined,
        'login retorna user': (r) => r.json('user') !== undefined,
        'login user tiene email': (r) => r.json('user.email') === 'admin@consecionaria.com',
    });

    const token = loginRes.json('token');
    sleep(1);

    // 2. Login con email incorrecto
    const badEmailRes = http.post(`${baseUrl}/api/auth/login`, JSON.stringify({
        email: 'usuario@invalido.com',
        password: 'consesionariachida'
    }), { headers });

    check(badEmailRes, {
        'email incorrecto status 401': (r) => r.status === 401,
        'email incorrecto tiene msg': (r) => r.json('msg') !== undefined,
    });
    sleep(1);

    // 3. Login con contraseña incorrecta
    const badPassRes = http.post(`${baseUrl}/api/auth/login`, JSON.stringify({
        email: 'admin@consecionaria.com',
        password: 'contraseña_incorrecta'
    }), { headers });

    check(badPassRes, {
        'password incorrecto status 401': (r) => r.status === 401,
    });
    sleep(1);

    // 4. Login sin email
    const noEmailRes = http.post(`${baseUrl}/api/auth/login`, JSON.stringify({
        password: 'consesionariachida'
    }), { headers });

    check(noEmailRes, {
        'sin email status 400': (r) => r.status === 400,
        'sin email tiene msg': (r) => r.json('msg') !== undefined,
    });
    sleep(1);

    // 5. Login sin contraseña
    const noPassRes = http.post(`${baseUrl}/api/auth/login`, JSON.stringify({
        email: 'admin@consecionaria.com'
    }), { headers });

    check(noPassRes, {
        'sin password status 400': (r) => r.status === 400,
    });
    sleep(1);

    // 6. Acceder a perfil con token válido
    const profileRes = http.get(`${baseUrl}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    check(profileRes, {
        'profile status 200': (r) => r.status === 200,
        'profile tiene email': (r) => r.json('email') === 'admin@consecionaria.com',
        'profile tiene id': (r) => r.json('id') !== undefined,
    });
    sleep(1);

    // 7. Acceder a perfil sin token
    const noTokenRes = http.get(`${baseUrl}/api/auth/profile`);

    check(noTokenRes, {
        'sin token status 401': (r) => r.status === 401,
    });
    sleep(1);

    // 8. Acceder a perfil con token inválido
    const badTokenRes = http.get(`${baseUrl}/api/auth/profile`, {
        headers: { 'Authorization': 'Bearer token_invalido_12345' }
    });

    check(badTokenRes, {
        'token invalido status 403': (r) => r.status === 403,
    });

    // 9. Acceder a ruta protegida sin token
    const protectedRes = http.get(`${baseUrl}/api/autos`);

    check(protectedRes, {
        'ruta protegida sin token status 401': (r) => r.status === 401,
    });
}
