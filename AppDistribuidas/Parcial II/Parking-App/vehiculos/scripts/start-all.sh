#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Stopping any running dev servers..."
pkill -f "nest start --watch" || true
pkill -f "node dist/main" || true

echo "Starting Postgres container..."
docker compose up -d

echo "Installing Node dependencies..."
npm install --prefer-offline --no-audit --no-fund

echo "Building application..."
DB_HOST=localhost DB_PORT=5433 DB_USUARIO=postgres DB_CONTRASENA=postgres DB_NOMBRE=gestion_vehiculos npm run build

echo "Starting application in background (prod)..."
mkdir -p logs
DB_HOST=localhost DB_PORT=5433 DB_USUARIO=postgres DB_CONTRASENA=postgres DB_NOMBRE=gestion_vehiculos nohup npm run start:prod > logs/app.log 2>&1 &

echo "Running DB seeds..."
DB_HOST=localhost DB_PORT=5433 DB_USUARIO=postgres DB_CONTRASENA=postgres DB_NOMBRE=gestion_vehiculos node scripts/run_seeds.js || true

echo "All services started. App should be reachable at http://localhost:3000"
