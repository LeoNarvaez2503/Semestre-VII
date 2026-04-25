import * as net from 'net';
import * as readline from 'readline';

const HOST = 'localhost';
const PORT = 12345;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Ingrese la operacion (ej: 'suma 5 3' o 'suma,5,3'): ", (answer: string) => {
  let msg = answer.trim();
  if (!msg.includes(',')) {
    const parts = msg.split(/\s+/);
    if (parts.length === 3) {
      msg = parts.join(',');
    }
  }

  const client = net.createConnection({ port: PORT, host: HOST }, () => {
    client.write(msg);
  });

  client.on('data', (data: { toString: () => any; }) => {
    console.log(`Resultado: ${data.toString()}`);
    client.end();
    rl.close();
  });

  client.on('error', (err: { message: any; }) => {
    console.error('Error:', err.message);
    rl.close();
  });
});
