"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const asignaciones_module_js_1 = require("./asignaciones/asignaciones.module.js");
const asignacion_entity_js_1 = require("./asignaciones/entities/asignacion.entity.js");
const auditoria_entity_js_1 = require("./asignaciones/entities/auditoria.entity.js");
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
                    database: configService.get('DB_NOMBRE', 'asignaciones_db'),
                    entities: [asignacion_entity_js_1.Asignacion, auditoria_entity_js_1.AuditoriaAsignacion],
                    synchronize: true,
                    logging: true,
                }),
                inject: [config_1.ConfigService],
            }),
            asignaciones_module_js_1.AsignacionesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map