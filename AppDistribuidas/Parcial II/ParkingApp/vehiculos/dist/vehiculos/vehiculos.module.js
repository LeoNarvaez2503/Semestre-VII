"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiculosModule = void 0;
const common_1 = require("@nestjs/common");
const vehicle_service_1 = require("./services/vehicle.service");
const vehicle_controller_1 = require("./controllers/vehicle.controller");
const typeorm_1 = require("@nestjs/typeorm");
const vehicle_entity_1 = __importDefault(require("./entities/vehicle.entity"));
const car_entity_1 = require("./entities/car.entity");
const motorcycle_entity_1 = require("./entities/motorcycle.entity");
const truck_entity_1 = require("./entities/truck.entity");
let VehiculosModule = class VehiculosModule {
};
exports.VehiculosModule = VehiculosModule;
exports.VehiculosModule = VehiculosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vehicle_entity_1.default, car_entity_1.Car, motorcycle_entity_1.Motorcycle, truck_entity_1.Truck])],
        controllers: [vehicle_controller_1.VehicleController],
        providers: [vehicle_service_1.VehicleService],
        exports: [vehicle_service_1.VehicleService],
    })
], VehiculosModule);
//# sourceMappingURL=vehiculos.module.js.map