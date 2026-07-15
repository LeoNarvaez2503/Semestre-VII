import { Injectable } from '@nestjs/common';

@Injectable()
export class SistemaBancarioService {
  getHello(): string {
    return 'Hello World!';
  }
}
