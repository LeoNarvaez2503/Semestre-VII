import { Test, TestingModule } from '@nestjs/testing';
import { SistemaBancarioController } from './sistema_bancario.controller';
import { SistemaBancarioService } from './sistema_bancario.service';

describe('SistemaBancarioController', () => {
  let sistemaBancarioController: SistemaBancarioController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SistemaBancarioController],
      providers: [SistemaBancarioService],
    }).compile();

    sistemaBancarioController = app.get<SistemaBancarioController>(SistemaBancarioController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sistemaBancarioController.getHello()).toBe('Hello World!');
    });
  });
});
