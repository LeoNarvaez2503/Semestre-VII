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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = __importDefault(require("./vehicle.entity"));
let Car = class Car extends vehicle_entity_1.default {
    doors;
    trunkCapacity;
    fuelType;
    getType() {
        return 'auto';
    }
};
exports.Car = Car;
__decorate([
    (0, typeorm_1.Column)({ name: 'puertas' }),
    __metadata("design:type", Number)
], Car.prototype, "doors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'capacidadMaletero' }),
    __metadata("design:type", Number)
], Car.prototype, "trunkCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipoCombustible' }),
    __metadata("design:type", String)
], Car.prototype, "fuelType", void 0);
exports.Car = Car = __decorate([
    (0, typeorm_1.ChildEntity)('auto')
], Car);
//# sourceMappingURL=car.entity.js.map