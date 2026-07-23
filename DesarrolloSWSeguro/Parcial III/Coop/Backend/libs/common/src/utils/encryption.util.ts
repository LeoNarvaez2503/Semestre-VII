import { ValueTransformer } from 'typeorm';
import * as crypto from 'crypto';

const algorithm = 'aes-256-gcm';
// In production, this should be set via environment variables (exactly 32 bytes)
const secretKey = process.env.ENCRYPTION_KEY || 'my-super-secret-key-32-chars-!!!'; 

export class EncryptionTransformer implements ValueTransformer {
  to(value: string | null | undefined): string | null | undefined {
    if (!value) return value;
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      // format: iv:authTag:encryptedText
      return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (error) {
      console.error('Error encrypting data:', error);
      return value;
    }
  }

  from(value: string | null | undefined): string | null | undefined {
    if (!value) return value;
    // Check if the string matches our encrypted format
    if (!value.includes(':')) return value;

    try {
      const [ivHex, authTagHex, encryptedHex] = value.split(':');
      if (!ivHex || !authTagHex || !encryptedHex) return value;

      const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey),
        Buffer.from(ivHex, 'hex'),
      );
      decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      // If decryption fails, it might be legacy unencrypted data
      return value;
    }
  }
}
