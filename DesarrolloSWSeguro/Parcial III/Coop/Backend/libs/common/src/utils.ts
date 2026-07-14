export const DEMO_PASSWORD = 'Demo2026!';

export const generateRefCode = (prefix: string): string =>
  `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

export const generateId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const toNumber = (value: number | string): number => Number(value);
