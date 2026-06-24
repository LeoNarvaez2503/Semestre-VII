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
exports.AuditoriaAsignacion = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const accion_auditoria_enum_js_1 = require("../enums/accion-auditoria.enum.js");
let AuditoriaAsignacion = class AuditoriaAsignacion {
    id;
    userId;
    vehicleId;
    accion;
    timestamp;
    payload;
};
exports.AuditoriaAsignacion = AuditoriaAsignacion;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'c2ggde11-2e3d-5fg0-dd8f-8dd1df502c33',
        description: 'ID único del evento de auditoría (UUID)',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditoriaAsignacion.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        description: 'ID del usuario afectado (parte de la clave compuesta)',
    }),
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], AuditoriaAsignacion.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b1ffcd00-1d2c-4ef9-cc7e-7cc0ce491b22',
        description: 'ID del vehículo afectado (parte de la clave compuesta)',
    }),
    (0, typeorm_1.Column)({ type: 'uuid', name: 'vehicle_id' }),
    __metadata("design:type", String)
], AuditoriaAsignacion.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: accion_auditoria_enum_js_1.AccionAuditoria,
        example: accion_auditoria_enum_js_1.AccionAuditoria.CREACION,
        description: 'Tipo de acción realizada (CREACION, MODIFICACION, ELIMINACION)',
    }),
    (0, typeorm_1.Column)({ name: 'accion', type: 'enum', enum: accion_auditoria_enum_js_1.AccionAuditoria }),
    __metadata("design:type", String)
], AuditoriaAsignacion.prototype, "accion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-06-24T14:30:00.000Z',
        description: 'Timestamp exacto del evento con zona horaria',
    }),
    (0, typeorm_1.Column)({
        name: 'timestamp',
        type: 'timestamptz',
        default: () => 'NOW()',
    }),
    __metadata("design:type", Date)
], AuditoriaAsignacion.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { anterior: { activo: true }, nuevo: { activo: false } },
        description: 'Payload con los datos anteriores vs. nuevos del cambio',
        required: false,
    }),
    (0, typeorm_1.Column)({ name: 'payload', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AuditoriaAsignacion.prototype, "payload", void 0);
exports.AuditoriaAsignacion = AuditoriaAsignacion = __decorate([
    (0, typeorm_1.Entity)({ name: 'auditoria_asignacion' })
], AuditoriaAsignacion);
//# sourceMappingURL=auditoria.entity.js.map