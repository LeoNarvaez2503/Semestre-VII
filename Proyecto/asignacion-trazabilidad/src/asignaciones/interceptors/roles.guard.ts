import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.path;

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Token no proporcionado', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    const secret = 'super-secret-key-for-jwt-signing-change-in-production';

    const payload = this.verifyHS256(token, secret);
    if (!payload) {
      throw new HttpException('Token inválido o expirado', HttpStatus.UNAUTHORIZED);
    }

    request.user = payload;

    const userRoles = payload.roles || [];
    const userId = payload.sub;

    // Root and Administrador have all privileges
    if (userRoles.includes('Root') || userRoles.includes('Administrador')) {
      return true;
    }

    // Cliente role has restricted access
    if (userRoles.includes('Cliente')) {
      // Cliente can ONLY check their own fleet: GET /asignaciones/propietario/:propietarioId
      const matchesOwner = path.match(/\/asignaciones\/propietario\/([^/]+)/);
      if (matchesOwner && matchesOwner[1] === userId) {
        return true;
      }
    }

    throw new HttpException('Acceso denegado: permisos insuficientes', HttpStatus.FORBIDDEN);
  }

  private verifyHS256(token: string, secret: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [headerB64, payloadB64, signatureB64] = parts;

      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${headerB64}.${payloadB64}`);
      const expectedSignature = hmac.digest('base64url');

      const expectedSigBuf = Buffer.from(expectedSignature);
      const actualSigBuf = Buffer.from(signatureB64);

      if (expectedSigBuf.length !== actualSigBuf.length || !crypto.timingSafeEqual(expectedSigBuf, actualSigBuf)) {
        return null;
      }

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));

      if (payload.exp && payload.exp < Date.now() / 1000) {
        return null;
      }

      return payload;
    } catch (e) {
      return null;
    }
  }
}
