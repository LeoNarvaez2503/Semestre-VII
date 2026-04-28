import * as net from 'net';

const PORT = 12345;
const PYTHON_SERVER_HOST = 'localhost';
const PYTHON_SERVER_PORT = 12346; // Puerto diferente para el servidor Python

const calculadora = (op: string, n1: number, n2: number): string => {
	switch (op) {
		case 'suma':
			return String(n1 + n2);
		case 'resta':
			return String(n1 - n2);
		case 'producto':
			return String(n1 * n2);
		case 'division':
			return n2 !== 0 ? String(n1 / n2) : 'Error: division por cero';
		default:
			return 'Error: Operacion no valida';
	}
};

let clientConnected = false;
let connectionCount = 0;

const server = net.createServer((socket: any) => {
	connectionCount++;
	console.log(`Cliente conectado. Número de conexión: ${connectionCount}`);

	if (!clientConnected) {
		clientConnected = true;
		socket.on('data', (data: any) => {
			const input = data.toString().trim();
			const parts = input.split(/\s+/);
			if (parts.length === 3) {
				const [op, n1s, n2s] = parts;
				const n1 = parseFloat(n1s);
				const n2 = parseFloat(n2s);
				if (Number.isNaN(n1) || Number.isNaN(n2)) {
					socket.write('Error: Numeros invalidos\n');
				} else {
					socket.write(`Resultado: ${calculadora(op, n1, n2)}\n`);
				}
			} else {
				socket.write('Error: Formato incorrecto, use "suma 5 3"\n');
			}
		});

		const resetMainClient = () => {
			if (clientConnected) {
				clientConnected = false;
				console.log('Cliente principal desconectado, el siguiente cliente será aceptado por el servidor principal.');
			}
		};

		socket.on('end', resetMainClient);
		socket.on('close', resetMainClient);
		socket.on('error', (err: any) => {
			console.error('Error en el socket principal:', err.message);
			resetMainClient();
		});
	} else {
		console.log(`Servidor principal ocupado. Redirigiendo conexión ${connectionCount} al servidor con hilos.`);
		const proxy = net.connect({ host: PYTHON_SERVER_HOST, port: PYTHON_SERVER_PORT }, () => {
			console.log(`Proxy activado para la conexión ${connectionCount} hacia ${PYTHON_SERVER_HOST}:${PYTHON_SERVER_PORT}`);
			socket.pipe(proxy);
			proxy.pipe(socket);
		});

		proxy.on('error', (err: any) => {
			console.error(`Error de proxy en conexión ${connectionCount}:`, err.message);
			socket.write('No se pudo conectar al servidor Python.\n');
			socket.end();
		});

		socket.on('error', (err: any) => {
			console.error(`Error de socket cliente en conexión ${connectionCount}:`, err.message);
			proxy.end();
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
