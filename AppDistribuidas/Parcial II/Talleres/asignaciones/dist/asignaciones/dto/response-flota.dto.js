"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFlotaDto = exports.VehiculoFlotaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class VehiculoFlotaDto {
    vehicleId;
    placa;
    marca;
    modelo;
    anio;
    color;
    tipo;
    clasificacion;
    fechaAsignacion;
}
exports.VehiculoFlotaDto = VehiculoFlotaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'b1ffcd00-1d2c-4ef9-cc7e-7cc0ce491b22' }),
    __metadata("design:type", String)
], VehiculoFlotaDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PCG1234' }),
    __metadata("design:type", String)
], VehiculoFlotaDto.prototype, "placa", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chevrolet' }),
    __metadata("design:type", String)
], VehiculoFlotaDto.prototype, "marca", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sail' }),
    __metadata("design:type", String)
], VehiculoFlotaDto.prototype, "modelo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2020 }),
    __metadata("design:type", Number)
], VehiculoFlotaDto.prototype, "anio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rojo' }),
    __metadata("design:type", String)
], VehiculoFlotaDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AUTO' }),
    __metadata("design:type", String)
], VehiculoFlotaDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Gasolina' }),
    __metadata("design:type", String)
], VehiculoFlotaDto.prototype, "clasificacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-24T09:30:00-05:00' }),
    __metadata("design:type", Date)
], VehiculoFlotaDto.prototype, "fechaAsignacion", void 0);
class ResponseFlotaDto {
    userId;
    vehiculos;
    totalVehiculos;
}
exports.ResponseFlotaDto = ResponseFlotaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' }),
    __metadata("design:type", String)
], ResponseFlotaDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [VehiculoFlotaDto] }),
    __metadata("design:type", Array)
], ResponseFlotaDto.prototype, "vehiculos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ResponseFlotaDto.prototype, "totalVehiculos", void 0);
//# sourceMappingURL=response-flota.dto.js.map