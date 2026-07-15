# Stage 1: Build the applications
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx nest build sistema_bancario

# Stage 2: Runner image
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/apps/sistema_bancario/apps/sistema_bancario/src/main.js"]
