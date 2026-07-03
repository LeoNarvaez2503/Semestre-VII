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
exports.Classification = void 0;
const typeorm_1 = require("typeorm");
var Classification;
(function (Classification) {
    Classification["ELECTRICO"] = "Electrico";
    Classification["HIBRIDO"] = "Hibrido";
    Classification["GASOLINA"] = "Gasolina";
    Classification["DIESEL"] = "Diesel";
})(Classification || (exports.Classification = Classification = {}));
let Vehicle = class Vehicle {
    id;
    plate;
    brand;
    model;
    color;
    year;
    classification;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'placa', unique: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "plate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'marca' }),
    __metadata("design:type", String)
], Vehicle.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'modelo' }),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color' }),
    __metadata("design:type", String)
], Vehicle.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'anio' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clasificacion', type: 'enum', enum: Classification }),
    __metadata("design:type", String)
], Vehicle.prototype, "classification", void 0);
Vehicle = __decorate([
    (0, typeorm_1.Entity)({ name: 'vehiculo' }),
    (0, typeorm_1.TableInheritance)({ column: { type: 'varchar', name: 'tipo' } })
], Vehicle);
exports.default = Vehicle;
//# sourceMappingURL=vehicle.entity.js.map