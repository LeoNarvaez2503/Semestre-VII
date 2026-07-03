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
exports.CreateVehicleDto = exports.TruckDto = exports.MotorcycleDto = exports.CarDto = exports.BaseVehicleDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const vehicle_entity_1 = require("../entities/vehicle.entity");
const custom_validators_1 = require("../validators/custom-validators");
class BaseVehicleDto {
    plate;
    brand;
    model;
    color;
    year;
    classification;
}
exports.BaseVehicleDto = BaseVehicleDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'La placa debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La placa no puede estar vacía' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toUpperCase().replace(/\s+/g, '') : value),
    (0, custom_validators_1.IsNoSpaces)({ message: 'La placa no puede contener espacios' }),
    (0, class_validator_1.Matches)(/^[A-Z]{3}\d{4}$/, {
        message: 'La placa debe tener el formato AAA1234',
    }),
    __metadata("design:type", String)
], BaseVehicleDto.prototype, "plate", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La marca debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La marca no puede estar vacía' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value),
    (0, custom_validators_1.IsNoSpaces)({ message: 'La marca no puede contener espacios' }),
    (0, custom_validators_1.IsSafeText)({ message: 'La marca contiene caracteres o términos reservados no permitidos (Inyección SQL)' }),
    (0, class_validator_1.MinLength)(2, { message: 'La marca debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(30, { message: 'La marca debe tener como máximo 30 caracteres' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
        message: 'La marca solo puede contener letras y guiones',
    }),
    __metadata("design:type", String)
], BaseVehicleDto.prototype, "brand", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El modelo debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El modelo no puede estar vacío' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value),
    (0, custom_validators_1.IsNoSpaces)({ message: 'El modelo no puede contener espacios' }),
    (0, custom_validators_1.IsSafeText)({ message: 'El modelo contiene caracteres o términos reservados no permitidos (Inyección SQL)' }),
    (0, class_validator_1.MinLength)(2, { message: 'El modelo debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(30, { message: 'El modelo debe tener como máximo 30 caracteres' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
        message: 'El modelo solo puede contener letras y guiones',
    }),
    __metadata("design:type", String)
], BaseVehicleDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El color debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El color no puede estar vacío' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value),
    (0, custom_validators_1.IsNoSpaces)({ message: 'El color no puede contener espacios' }),
    (0, custom_validators_1.IsSafeText)({ message: 'El color contiene caracteres o términos reservados no permitidos (Inyección SQL)' }),
    (0, class_validator_1.MinLength)(2, { message: 'El color debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(30, { message: 'El color debe tener como máximo 30 caracteres' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
        message: 'El color solo puede contener letras y guiones',
    }),
    __metadata("design:type", String)
], BaseVehicleDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'El año debe ser un número' }),
    (0, class_validator_1.IsInt)({ message: 'El año debe ser un número entero' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El año no puede estar vacío' }),
    (0, class_validator_1.Min)(1885, { message: 'El año debe ser mayor o igual a 1885' }),
    __metadata("design:type", Number)
], BaseVehicleDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(vehicle_entity_1.Classification, { message: 'La clasificación debe ser un valor válido (Electrico, Hibrido, Gasolina, Diesel)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La clasificación no puede estar vacía' }),
    __metadata("design:type", String)
], BaseVehicleDto.prototype, "classification", void 0);
class CarDto extends BaseVehicleDto {
    doors;
    fuelType;
    trunkCapacity;
}
exports.CarDto = CarDto;
__decorate([
    (0, class_validator_1.IsInt)({ message: 'El número de puertas debe ser un número entero' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de puertas no puede estar vacío' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El número de puertas debe ser un número' }),
    (0, class_validator_1.Min)(2, { message: 'El número de puertas debe ser mayor o igual a 2' }),
    __metadata("design:type", Number)
], CarDto.prototype, "doors", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El tipo de combustible debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de combustible no puede estar vacío' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value),
    (0, custom_validators_1.IsNoSpaces)({ message: 'El tipo de combustible no puede contener espacios' }),
    (0, custom_validators_1.IsSafeText)({ message: 'El tipo de combustible contiene caracteres o términos reservados no permitidos (Inyección SQL)' }),
    (0, class_validator_1.MinLength)(2, {
        message: 'El tipo de combustible debe tener al menos 2 caracteres',
    }),
    (0, class_validator_1.MaxLength)(30, {
        message: 'El tipo de combustible debe tener como máximo 30 caracteres',
    }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
        message: 'El tipo de combustible solo puede contener letras y guiones',
    }),
    __metadata("design:type", String)
], CarDto.prototype, "fuelType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La capacidad del maletero debe ser un número' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La capacidad del maletero no puede estar vacía' }),
    (0, class_validator_1.Min)(2, { message: 'La capacidad del maletero debe ser mayor o igual a 2' }),
    __metadata("design:type", Number)
], CarDto.prototype, "trunkCapacity", void 0);
class MotorcycleDto extends BaseVehicleDto {
    type;
}
exports.MotorcycleDto = MotorcycleDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'La placa debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La placa no puede estar vacía' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toUpperCase().replace(/\s+/g, '') : value),
    (0, custom_validators_1.IsNoSpaces)({ message: 'La placa no puede contener espacios' }),
    (0, class_validator_1.Matches)(/^[A-Z]{2}-\d{3}[A-Z]{1}$/, {
        message: 'La placa debe tener el formato AA-123A',
    }),
    __metadata("design:type", String)
], MotorcycleDto.prototype, "plate", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El tipo debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo no puede estar vacío' }),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value),
    (0, custom_validators_1.IsNoSpaces)({ message: 'El tipo no puede contener espacios' }),
    (0, custom_validators_1.IsSafeText)({ message: 'El tipo contiene caracteres o términos reservados no permitidos (Inyección SQL)' }),
    (0, class_validator_1.MinLength)(2, { message: 'El tipo debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(30, { message: 'El tipo debe tener como máximo 30 caracteres' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
        message: 'El tipo solo puede contener letras y guiones',
    }),
    __metadata("design:type", String)
], MotorcycleDto.prototype, "type", void 0);
class TruckDto extends BaseVehicleDto {
    cabin;
    loadCapacity;
}
exports.TruckDto = TruckDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La cabina debe ser un número' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La cabina no puede estar vacía' }),
    (0, class_validator_1.Min)(1, { message: 'La cabina debe ser mayor o igual a 1' }),
    (0, class_validator_1.Max)(2, { message: 'La cabina debe ser menor o igual a 2' }),
    __metadata("design:type", Number)
], TruckDto.prototype, "cabin", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La capacidad de carga debe ser un número' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La capacidad de carga no puede estar vacía' }),
    (0, class_validator_1.Min)(1, { message: 'La capacidad de carga debe ser mayor o igual a 1' }),
    __metadata("design:type", Number)
], TruckDto.prototype, "loadCapacity", void 0);
class CreateVehicleDto {
    type;
    data;
}
exports.CreateVehicleDto = CreateVehicleDto;
__decorate([
    (0, class_validator_1.IsIn)(['Auto', 'Moto', 'Camioneta', 'auto', 'moto', 'camioneta'], { message: 'El tipo de vehículo debe ser uno de los siguientes valores: Auto, Moto, Camioneta, auto, moto, camioneta' }),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)((opts) => {
        const object = opts?.object;
        if (!object)
            return BaseVehicleDto;
        const tipo = object.type.toLowerCase();
        switch (tipo) {
            case 'auto':
            case 'car':
                return CarDto;
            case 'moto':
            case 'motorcycle':
                return MotorcycleDto;
            case 'camioneta':
            case 'truck':
                return TruckDto;
            default:
                return BaseVehicleDto;
        }
    }),
    __metadata("design:type", Object)
], CreateVehicleDto.prototype, "data", void 0);
//# sourceMappingURL=create-vehicle.dto.js.map