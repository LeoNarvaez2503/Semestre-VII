import { Controller, Get } from '@nestjs/common';
import { SistemaBancarioService } from './sistema_bancario.service';

@Controller()
export class SistemaBancarioController {
  constructor(private readonly sistemaBancarioService: SistemaBancarioService) {}

  @Get()
  getHello(): string {
    return this.sistemaBancarioService.getHello();
  }
}
