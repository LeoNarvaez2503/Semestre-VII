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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const vehiculos_module_1 = require("./vehiculos/vehiculos.module");
const vehicle_entity_1 = __importDefault(require("./vehiculos/entities/vehicle.entity"));
const car_entity_1 = require("./vehiculos/entities/car.entity");
const motorcycle_entity_1 = require("./vehiculos/entities/motorcycle.entity");
const truck_entity_1 = require("./vehiculos/entities/truck.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: Number(configService.get('DB_PORT', 5432)),
                    username: configService.get('DB_USUARIO', 'postgres'),
                    password: configService.get('DB_CONTRASENA', ''),
                    database: configService.get('DB_NOMBRE', 'vehiculos'),
                    entities: [vehicle_entity_1.default, car_entity_1.Car, motorcycle_entity_1.Motorcycle, truck_entity_1.Truck],
                    synchronize: true,
                    logging: true,
                }),
                inject: [config_1.ConfigService],
            }),
            vehiculos_module_1.VehiculosModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map