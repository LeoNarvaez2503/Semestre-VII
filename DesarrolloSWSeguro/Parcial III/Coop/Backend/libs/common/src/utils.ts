import { Transform } from 'class-transformer';
import * as crypto from 'crypto';
import Redis from 'ioredis';

export const DEMO_PASSWORD = 'Demo2026!';

export const generateRefCode = (prefix: string): string =>
  `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

export const generateId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const toNumber = (value: number | string): number => Number(value);

export const TransformStrictMonetary = () => Transform(({ value }) => {
  if (value === null || value === undefined) return value;
  
  // Validar si es una cadena de texto
  if (typeof value === 'string') {
    // Regex: Solo dígitos, opcionalmente un punto y 1 o 2 decimales. Sin signo, sin letras.
    if (/^\d+(\.\d{1,2})?$/.test(value)) {
      const num = Number(value);
      return isNaN(num) ? NaN : num;
    }
    return NaN;
  }
  
  // Validar si es un número directamente
  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) return NaN;
    // Validar formato (evitar notación científica o más de 2 decimales)
    if (/^\d+(\.\d{1,2})?$/.test(String(value))) {
      return value;
    }
    return NaN;
  }
  
  return NaN;
});

// Hashing seguro de contraseñas con scrypt
export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
  if (!storedHash) return false;
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return verifyHash === hash;
};

// Firma y verificación de JWT (HS256) nativa
export const signJwt = (payload: any, secret: string, expiresInSeconds: number): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadWithExp = { ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
  const base64Payload = Buffer.from(JSON.stringify(payloadWithExp)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${base64Header}.${base64Payload}`).digest('base64url');
  return `${base64Header}.${base64Payload}.${signature}`;
};

export const verifyJwt = (token: string, secret: string): any => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  if (signature !== expectedSignature) return null;
  
  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) return null;
    return decodedPayload;
  } catch {
    return null;
  }
};

// Cliente Redis compartido
let redisClientInstance: Redis | null = null;
export const getRedisClient = (): Redis => {
  if (!redisClientInstance) {
    redisClientInstance = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }
  return redisClientInstance;
};
