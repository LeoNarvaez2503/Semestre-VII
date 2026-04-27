declare const require: any;

const net = require('net');

const PORT = 12345;
const PYTHON_SERVER_HOST = 'localhost';
const PYTHON_SERVER_PORT = 12346; // Puerto diferente para el servidor Python


let clientConnected = false;
let connectionCount = 0;

const server = net.createServer((socket: any) => {
	connectionCount++;
	if (!clientConnected) {
		clientConnected = true;
		console.log(`Cliente conectado como principal. Número de conexión: ${connectionCount}`);
		socket.write('Bienvenido, eres el cliente principal.\n');
		socket.on('data', (data: any) => {

			socket.write(`Echo del servidor concurrente: ${data.toString()}`);
		});
		socket.on('end', () => {
			clientConnected = false;
		});
		socket.on('close', () => {
			clientConnected = false;
		});
		socket.on('error', () => {
			clientConnected = false;
		});
	} else {
		console.log(`Cliente redirigido al servidor con hilos (proxy activado). Número de conexión: ${connectionCount}`);
		// Proxy: redirigir datos entre el cliente y el servidor Python
		const proxy = net.connect({ host: PYTHON_SERVER_HOST, port: PYTHON_SERVER_PORT }, () => {
			// Cuando el proxy se conecta, todo lo que reciba el cliente se envía al servidor Python
			socket.pipe(proxy);
			// Todo lo que reciba del servidor Python se envía al cliente
			proxy.pipe(socket);
		});
		proxy.on('error', () => {
			socket.write('No se pudo conectar al servidor con hilos.\n');
			socket.end();
		});
		socket.on('close', () => {
			proxy.end();
		});
		proxy.on('close', () => {
			socket.end();
		});
	}
});

server.listen(PORT, () => {
	console.log(`Servidor concurrente escuchando en el puerto ${PORT}`);
});
