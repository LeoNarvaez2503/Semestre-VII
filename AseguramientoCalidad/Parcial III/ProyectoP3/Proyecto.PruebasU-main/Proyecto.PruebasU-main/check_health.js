const https = require('https');

const url = 'https://proyecto-pruebasu.onrender.com/';

console.log('Pinging backend...');

const req = https.get(url, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log('Backend is awake!');
    } else {
        console.log('Backend returned non-200 status');
    }
});

req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
