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
exports.Motorcycle = exports.MotorcycleType = void 0;
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = __importDefault(require("./vehicle.entity"));
var MotorcycleType;
(function (MotorcycleType) {
    MotorcycleType["DEPORTIVA"] = "Deportiva";
    MotorcycleType["SCOOTER"] = "Scooter";
    MotorcycleType["MOTOCROSS"] = "Motocross";
})(MotorcycleType || (exports.MotorcycleType = MotorcycleType = {}));
let Motorcycle = class Motorcycle extends vehicle_entity_1.default {
    motorcycleType;
    getType() {
        return 'moto';
    }
};
exports.Motorcycle = Motorcycle;
__decorate([
    (0, typeorm_1.Column)({ name: 'tipoMoto', type: 'enum', enum: MotorcycleType }),
    __metadata("design:type", String)
], Motorcycle.prototype, "motorcycleType", void 0);
exports.Motorcycle = Motorcycle = __decorate([
    (0, typeorm_1.ChildEntity)('moto')
], Motorcycle);
//# sourceMappingURL=motorcycle.entity.js.map