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
exports.UpdateAsignacionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateAsignacionDto {
    userId;
    vehicleId;
    nuevoUserId;
    notas;
}
exports.UpdateAsignacionDto = UpdateAsignacionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario/propietario actual (UUID)',
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'El userId debe ser un UUID válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El userId no puede estar vacío' }),
    __metadata("design:type", String)
], UpdateAsignacionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del vehículo asignado (UUID)',
        example: 'b1ffcd00-1d2c-4ef9-cc7e-7cc0ce491b22',
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'El vehicleId debe ser un UUID válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El vehicleId no puede estar vacío' }),
    __metadata("design:type", String)
], UpdateAsignacionDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del nuevo propietario (UUID) — para transferencia de vehículo',
        example: 'c2ggde11-2e3d-5fg0-dd8f-8dd1df502c33',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'El nuevoUserId debe ser un UUID válido' }),
    __metadata("design:type", String)
], UpdateAsignacionDto.prototype, "nuevoUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas actualizadas de la asignación',
        example: 'Transferido por cambio de propietario',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Las notas deben ser un texto' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Las notas no pueden exceder 500 caracteres' }),
    __metadata("design:type", String)
], UpdateAsignacionDto.prototype, "notas", void 0);
//# sourceMappingURL=update-asignacion.dto.js.map