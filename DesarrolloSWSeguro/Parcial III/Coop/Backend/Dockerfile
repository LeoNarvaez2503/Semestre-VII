# Stage 1: Build the applications
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and lockfile
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy codebase
COPY . .

# Build all NestJS apps (clientes, cuentas, transacciones)
RUN npm run build

# Stage 2: Runner image
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code from builder
COPY --from=builder /usr/src/app/dist ./dist

# Default command, can be overridden in docker-compose.yml
CMD ["node", "dist/apps/clientes/apps/clientes/src/main.js"]
