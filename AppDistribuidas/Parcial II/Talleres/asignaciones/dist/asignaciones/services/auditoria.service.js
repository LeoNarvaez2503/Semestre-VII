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
var AuditoriaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoriaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auditoria_entity_js_1 = require("../entities/auditoria.entity.js");
let AuditoriaService = AuditoriaService_1 = class AuditoriaService {
    auditoriaRepository;
    logger = new common_1.Logger(AuditoriaService_1.name);
    constructor(auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }
    async registrar(params) {
        try {
            const evento = this.auditoriaRepository.create({
                userId: params.userId,
                vehicleId: params.vehicleId,
                accion: params.accion,
                payload: params.payload ?? null,
            });
            const saved = await this.auditoriaRepository.save(evento);
            this.logger.log(`Auditoría registrada: ${params.accion} para user=${params.userId}, vehicle=${params.vehicleId}`);
            return saved;
        }
        catch (error) {
            this.logger.error(`Error al registrar auditoría: ${error}`);
            throw error;
        }
    }
    async listarTodos() {
        return this.auditoriaRepository.find({
            order: { timestamp: 'DESC' },
        });
    }
    async listarPorAsignacion(userId, vehicleId) {
        return this.auditoriaRepository.find({
            where: { userId, vehicleId },
            order: { timestamp: 'DESC' },
        });
    }
};
exports.AuditoriaService = AuditoriaService;
exports.AuditoriaService = AuditoriaService = AuditoriaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auditoria_entity_js_1.AuditoriaAsignacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditoriaService);
//# sourceMappingURL=auditoria.service.js.map