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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const asignacion_service_js_1 = require("../services/asignacion.service.js");
const auditoria_service_js_1 = require("../services/auditoria.service.js");
const create_asignacion_dto_js_1 = require("../dto/create-asignacion.dto.js");
const update_asignacion_dto_js_1 = require("../dto/update-asignacion.dto.js");
const auditoria_interceptor_js_1 = require("../interceptors/auditoria.interceptor.js");
let AsignacionController = class AsignacionController {
    asignacionService;
    auditoriaService;
    constructor(asignacionService, auditoriaService) {
        this.asignacionService = asignacionService;
        this.auditoriaService = auditoriaService;
    }
    crear(dto) {
        return this.asignacionService.crear(dto);
    }
    actualizar(dto) {
        return this.asignacionService.actualizar(dto);
    }
    eliminar(userId, vehicleId) {
        return this.asignacionService.eliminar(userId, vehicleId);
    }
    listar() {
        return this.asignacionService.listarTodas();
    }
    listarAuditoria() {
        return this.auditoriaService.listarTodos();
    }
    obtenerAuditoria(userId, vehicleId) {
        return this.auditoriaService.listarPorAsignacion(userId, vehicleId);
    }
};
exports.AsignacionController = AsignacionController;
__decorate([
    (0, common_1.Post)('crear'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una asignación de vehículo a propietario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Asignación creada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o usuario/vehículo no existe.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El vehículo ya está asignado a otro propietario.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asignacion_dto_js_1.CreateAsignacionDto]),
    __metadata("design:returntype", void 0)
], AsignacionController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)('actualizar'),
    (0, swagger_1.ApiOperation)({ summary: 'Modificar o transferir una asignación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asignación actualizada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asignación no encontrada.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asignacion_dto_js_1.UpdateAsignacionDto]),
    __metadata("design:returntype", void 0)
], AsignacionController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Delete)('eliminar/:userId/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar (desactivar) una asignación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asignación eliminada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Asignación activa no encontrada.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('vehicleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AsignacionController.prototype, "eliminar", null);
__decorate([
    (0, common_1.Get)('listar'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las asignaciones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de asignaciones.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AsignacionController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('auditoria/listar'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los eventos de auditoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de eventos de auditoría.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AsignacionController.prototype, "listarAuditoria", null);
__decorate([
    (0, common_1.Get)('auditoria/:userId/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener auditoría de una asignación específica' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Eventos de auditoría de la asignación.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('vehicleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AsignacionController.prototype, "obtenerAuditoria", null);
exports.AsignacionController = AsignacionController = __decorate([
    (0, swagger_1.ApiTags)('Asignaciones'),
    (0, common_1.Controller)('asignaciones'),
    (0, common_1.UseInterceptors)(auditoria_interceptor_js_1.AuditoriaInterceptor),
    __metadata("design:paramtypes", [asignacion_service_js_1.AsignacionService,
        auditoria_service_js_1.AuditoriaService])
], AsignacionController);
//# sourceMappingURL=asignacion.controller.js.map