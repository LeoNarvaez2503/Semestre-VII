# --- STAGE 1: Build ---
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Instalar npm 9.x manualmente para evitar el bug "Exit handler never called" de npm 10.x/11.x
RUN node -e " \
  const https = require('https'); \
  const fs = require('fs'); \
  const file = fs.createWriteStream('/tmp/npm.tgz'); \
  https.get('https://registry.npmjs.org/npm/-/npm-9.9.3.tgz', res => { \
    res.pipe(file); \
    file.on('finish', () => file.close()); \
  });" && \
  mkdir -p /tmp/npm && \
  tar -xzf /tmp/npm.tgz -C /tmp/npm && \
  rm /tmp/npm.tgz

# Copiar archivos de dependencias e instalar todas (incluidas devDependencies para compilar)
COPY package*.json ./
RUN node /tmp/npm/package/bin/npm-cli.js install && \
  rm -rf /tmp/npm

# Copiar código fuente
COPY . .

# Compilar la aplicación NestJS
RUN npm run build

# --- STAGE 2: Run ---
FROM node:20-slim

WORKDIR /usr/src/app

# Instalar npm 9.x manualmente
RUN node -e " \
  const https = require('https'); \
  const fs = require('fs'); \
  const file = fs.createWriteStream('/tmp/npm.tgz'); \
  https.get('https://registry.npmjs.org/npm/-/npm-9.9.3.tgz', res => { \
    res.pipe(file); \
    file.on('finish', () => file.close()); \
  });" && \
  mkdir -p /tmp/npm && \
  tar -xzf /tmp/npm.tgz -C /tmp/npm && \
  rm /tmp/npm.tgz

# Copiar archivos de dependencias e instalar solo las de producción
COPY package*.json ./
RUN node /tmp/npm/package/bin/npm-cli.js install --omit=dev && \
  rm -rf /tmp/npm

# Copiar el código compilado desde la etapa builder
COPY --from=builder /usr/src/app/dist ./dist

# Exponer el puerto
EXPOSE 3000

# Ejecutar la aplicación
CMD ["node", "dist/main"]
