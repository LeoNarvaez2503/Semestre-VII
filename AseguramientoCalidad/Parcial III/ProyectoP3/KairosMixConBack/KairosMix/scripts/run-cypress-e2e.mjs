import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const port = 3000;
const host = '127.0.0.1';
const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const cypressCli = fileURLToPath(new URL('../node_modules/cypress/bin/cypress', import.meta.url));

const e2eServer = await createServer({
  configFile: false,
  root: projectRoot,
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  optimizeDeps: {
    noDiscovery: true,
  },
  server: {
    host,
    port,
    strictPort: true,
    fs: {
      strict: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  base: '/',
});

await e2eServer.listen();

const shutdown = async () => {
  await e2eServer.close();
};

process.on('SIGINT', () => {
  shutdown();
  process.exit(130);
});

process.on('SIGTERM', () => {
  shutdown();
  process.exit(143);
});

try {
  const cypress = spawn(process.execPath, [cypressCli, 'run'], {
    stdio: 'inherit',
    shell: false,
    cwd: projectRoot,
  });

  cypress.on('close', (code) => {
    shutdown().finally(() => {});
    process.exit(code ?? 1);
  });
} catch (error) {
  await shutdown();
  console.error(error.message);
  process.exit(1);
}
