# Stage 1: Build the SPA
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy codebase
COPY . .

# Set environment variables for the build
ARG VITE_USE_BACKEND=true
ARG VITE_CLIENTES_API_URL=http://localhost:3000/api/clientes
ARG VITE_CUENTAS_API_URL=http://localhost:3000/api/cuentas
ARG VITE_TRANSACCIONES_API_URL=http://localhost:3000/api/transacciones

ENV VITE_USE_BACKEND=$VITE_USE_BACKEND
ENV VITE_CLIENTES_API_URL=$VITE_CLIENTES_API_URL
ENV VITE_CUENTAS_API_URL=$VITE_CUENTAS_API_URL
ENV VITE_TRANSACCIONES_API_URL=$VITE_TRANSACCIONES_API_URL

# Build the project
RUN npm run build

# Stage 2: Serve using Nginx (Unprivileged non-root user image)
FROM nginxinc/nginx-unprivileged:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
