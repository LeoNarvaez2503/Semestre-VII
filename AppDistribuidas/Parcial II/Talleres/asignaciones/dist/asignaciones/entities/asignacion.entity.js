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
exports.Asignacion = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Asignacion = class Asignacion {
    userId;
    vehicleId;
    activo;
    fechaAsignacion;
    notas;
};
exports.Asignacion = Asignacion;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID del usuario/propietario (UUID) — parte de la clave compuesta',
    }),
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], Asignacion.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b1ffcd00-1d2c-4ef9-cc7e-7cc0ce491b22',
        description: 'ID del vehículo (UUID) — parte de la clave compuesta',
    }),
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid', name: 'vehicle_id' }),
    __metadata("design:type", String)
], Asignacion.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Estado activo de la asignación' }),
    (0, typeorm_1.Column)({ name: 'activo', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Asignacion.prototype, "activo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-06-24T09:30:00-05:00',
        description: 'Fecha y hora de la asignación con zona horaria',
    }),
    (0, typeorm_1.Column)({
        name: 'fecha_asignacion',
        type: 'timestamptz',
        default: () => 'NOW()',
    }),
    __metadata("design:type", Date)
], Asignacion.prototype, "fechaAsignacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Asignación inicial del vehículo',
        description: 'Notas opcionales sobre la asignación',
        required: false,
    }),
    (0, typeorm_1.Column)({ name: 'notas', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Asignacion.prototype, "notas", void 0);
exports.Asignacion = Asignacion = __decorate([
    (0, typeorm_1.Entity)({ name: 'asignacion' })
], Asignacion);
//# sourceMappingURL=asignacion.entity.js.map