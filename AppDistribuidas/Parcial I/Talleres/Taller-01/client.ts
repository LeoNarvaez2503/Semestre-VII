import * as net from 'net';
import * as readline from 'readline';

const HOST = 'localhost';
const PORT = 12345;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const client = net.connect({ port: PORT, host: HOST });

rl.question("\nIngrese la operacion (ej: suma 5 3): ", (answer: string) => {
  const msg = answer.trim();
  client.write(msg);

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
