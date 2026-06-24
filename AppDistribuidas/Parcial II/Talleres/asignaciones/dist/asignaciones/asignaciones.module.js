"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asignacion_entity_js_1 = require("./entities/asignacion.entity.js");
const auditoria_entity_js_1 = require("./entities/auditoria.entity.js");
const asignacion_service_js_1 = require("./services/asignacion.service.js");
const auditoria_service_js_1 = require("./services/auditoria.service.js");
const vehiculo_client_service_js_1 = require("./services/vehiculo-client.service.js");
const asignacion_controller_js_1 = require("./controllers/asignacion.controller.js");
const flota_controller_js_1 = require("./controllers/flota.controller.js");
const auditoria_interceptor_js_1 = require("./interceptors/auditoria.interceptor.js");
let AsignacionesModule = class AsignacionesModule {
};
exports.AsignacionesModule = AsignacionesModule;
exports.AsignacionesModule = AsignacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([asignacion_entity_js_1.Asignacion, auditoria_entity_js_1.AuditoriaAsignacion])],
        controllers: [asignacion_controller_js_1.AsignacionController, flota_controller_js_1.FlotaController],
        providers: [
            asignacion_service_js_1.AsignacionService,
            auditoria_service_js_1.AuditoriaService,
            vehiculo_client_service_js_1.VehiculoClientService,
            auditoria_interceptor_js_1.AuditoriaInterceptor,
        ],
        exports: [asignacion_service_js_1.AsignacionService, auditoria_service_js_1.AuditoriaService],
    })
], AsignacionesModule);
//# sourceMappingURL=asignaciones.module.js.map