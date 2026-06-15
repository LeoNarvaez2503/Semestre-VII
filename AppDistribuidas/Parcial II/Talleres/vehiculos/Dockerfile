FROM node:20-slim

WORKDIR /usr/src/app

# Instalar npm 9.x manualmente para evitar el bug "Exit handler never called" de npm 10.x/11.x
# Se descarga npm 9.9.3 usando node directamente y se usa para instalar dependencias
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

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción usando npm 9.9.3
RUN node /tmp/npm/package/bin/npm-cli.js install --omit=dev && \
  rm -rf /tmp/npm

# Copiar el código compilado (generado localmente con npm run build)
COPY dist ./dist

# Exponer el puerto
EXPOSE 3000

# Ejecutar la aplicación
CMD ["node", "dist/main"]
