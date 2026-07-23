FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL=/api/auth
ENV NEXT_PUBLIC_BOOKING_URL=/api/bookings
ENV NEXT_PUBLIC_USER_URL=/api/users

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
