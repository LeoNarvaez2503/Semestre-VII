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
exports.FlotaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const asignacion_service_js_1 = require("../services/asignacion.service.js");
const response_flota_dto_js_1 = require("../dto/response-flota.dto.js");
let FlotaController = class FlotaController {
    asignacionService;
    constructor(asignacionService) {
        this.asignacionService = asignacionService;
    }
    obtenerFlota(userId) {
        return this.asignacionService.obtenerFlota(userId);
    }
};
exports.FlotaController = FlotaController;
__decorate([
    (0, common_1.Get)('flota/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Consultar la flota de vehículos de un propietario (RF3)',
        description: 'Retorna la lista de vehículos asignados al usuario, con detalle de tipo y categoría obtenidos del microservicio de vehículos.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Flota del propietario con detalle de cada vehículo.',
        type: response_flota_dto_js_1.ResponseFlotaDto,
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlotaController.prototype, "obtenerFlota", null);
exports.FlotaController = FlotaController = __decorate([
    (0, swagger_1.ApiTags)('Flota'),
    (0, common_1.Controller)('asignaciones'),
    __metadata("design:paramtypes", [asignacion_service_js_1.AsignacionService])
], FlotaController);
//# sourceMappingURL=flota.controller.js.map