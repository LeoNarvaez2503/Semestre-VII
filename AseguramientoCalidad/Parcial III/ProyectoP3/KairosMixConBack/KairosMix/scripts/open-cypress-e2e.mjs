import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const host = '127.0.0.1';
const port = 3000;
const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const cypressCli = fileURLToPath(new URL('../node_modules/cypress/bin/cypress', import.meta.url));

const viteServer = await createServer({
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

await viteServer.listen();

const cypress = spawn(process.execPath, [cypressCli, 'open', '--e2e', '--browser', 'chrome'], {
  stdio: 'inherit',
  shell: false,
  cwd: projectRoot,
});

const shutdown = async () => {
  await viteServer.close();
};

process.on('SIGINT', async () => {
  cypress.kill();
  await shutdown();
  process.exit(130);
});

process.on('SIGTERM', async () => {
  cypress.kill();
  await shutdown();
  process.exit(143);
});

cypress.on('close', (code) => {
  shutdown().finally(() => {});
  process.exit(code ?? 1);
});
