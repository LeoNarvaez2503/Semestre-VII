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
exports.AsignacionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asignacion_entity_js_1 = require("../entities/asignacion.entity.js");
const vehiculo_client_service_js_1 = require("./vehiculo-client.service.js");
const auditoria_service_js_1 = require("./auditoria.service.js");
const accion_auditoria_enum_js_1 = require("../enums/accion-auditoria.enum.js");
let AsignacionService = class AsignacionService {
    asignacionRepository;
    vehiculoClient;
    auditoriaService;
    constructor(asignacionRepository, vehiculoClient, auditoriaService) {
        this.asignacionRepository = asignacionRepository;
        this.vehiculoClient = vehiculoClient;
        this.auditoriaService = auditoriaService;
    }
    async crear(dto) {
        const validacionUsuario = await this.vehiculoClient.validarUsuario(dto.userId);
        if (!validacionUsuario.exists) {
            throw new common_1.BadRequestException(`El usuario con ID ${dto.userId} no existe.`);
        }
        if (!validacionUsuario.active) {
            throw new common_1.BadRequestException(`El usuario con ID ${dto.userId} está inactivo.`);
        }
        const validacionVehiculo = await this.vehiculoClient.validarVehiculo(dto.vehicleId);
        if (!validacionVehiculo.exists) {
            throw new common_1.BadRequestException(`El vehículo con ID ${dto.vehicleId} no existe.`);
        }
        const asignacionExistente = await this.asignacionRepository.findOne({
            where: { vehicleId: dto.vehicleId, activo: true },
        });
        if (asignacionExistente) {
            throw new common_1.ConflictException(`El vehículo con ID ${dto.vehicleId} ya está asignado al usuario ${asignacionExistente.userId}.`);
        }
        const duplicada = await this.asignacionRepository.findOne({
            where: { userId: dto.userId, vehicleId: dto.vehicleId, activo: true },
        });
        if (duplicada) {
            throw new common_1.ConflictException(`Ya existe una asignación activa entre el usuario ${dto.userId} y el vehículo ${dto.vehicleId}.`);
        }
        const asignacion = this.asignacionRepository.create({
            userId: dto.userId,
            vehicleId: dto.vehicleId,
            activo: true,
            notas: dto.notas ?? null,
        });
        const saved = await this.asignacionRepository.save(asignacion);
        await this.auditoriaService.registrar({
            userId: saved.userId,
            vehicleId: saved.vehicleId,
            accion: accion_auditoria_enum_js_1.AccionAuditoria.CREACION,
            payload: {
                nuevo: {
                    userId: saved.userId,
                    vehicleId: saved.vehicleId,
                    activo: saved.activo,
                    notas: saved.notas,
                    fechaAsignacion: saved.fechaAsignacion,
                },
            },
        });
        return saved;
    }
    async actualizar(dto) {
        const asignacionActual = await this.asignacionRepository.findOne({
            where: { userId: dto.userId, vehicleId: dto.vehicleId, activo: true },
        });
        if (!asignacionActual) {
            throw new common_1.NotFoundException(`No se encontró una asignación activa entre el usuario ${dto.userId} y el vehículo ${dto.vehicleId}.`);
        }
        const datosAnteriores = { ...asignacionActual };
        if (dto.nuevoUserId && dto.nuevoUserId !== dto.userId) {
            const validacionNuevoUsuario = await this.vehiculoClient.validarUsuario(dto.nuevoUserId);
            if (!validacionNuevoUsuario.exists) {
                throw new common_1.BadRequestException(`El nuevo usuario con ID ${dto.nuevoUserId} no existe.`);
            }
            if (!validacionNuevoUsuario.active) {
                throw new common_1.BadRequestException(`El nuevo usuario con ID ${dto.nuevoUserId} está inactivo.`);
            }
            asignacionActual.activo = false;
            await this.asignacionRepository.save(asignacionActual);
            await this.auditoriaService.registrar({
                userId: dto.userId,
                vehicleId: dto.vehicleId,
                accion: accion_auditoria_enum_js_1.AccionAuditoria.ELIMINACION,
                payload: {
                    anterior: {
                        userId: datosAnteriores.userId,
                        vehicleId: datosAnteriores.vehicleId,
                        activo: true,
                        notas: datosAnteriores.notas,
                    },
                    nuevo: { activo: false },
                    motivo: `Transferido al usuario ${dto.nuevoUserId}`,
                },
            });
            const nuevaAsignacion = this.asignacionRepository.create({
                userId: dto.nuevoUserId,
                vehicleId: dto.vehicleId,
                activo: true,
                notas: dto.notas ?? null,
            });
            const saved = await this.asignacionRepository.save(nuevaAsignacion);
            await this.auditoriaService.registrar({
                userId: saved.userId,
                vehicleId: saved.vehicleId,
                accion: accion_auditoria_enum_js_1.AccionAuditoria.CREACION,
                payload: {
                    nuevo: {
                        userId: saved.userId,
                        vehicleId: saved.vehicleId,
                        activo: saved.activo,
                        notas: saved.notas,
                    },
                    motivo: `Transferido desde el usuario ${dto.userId}`,
                },
            });
            return saved;
        }
        if (dto.notas !== undefined) {
            asignacionActual.notas = dto.notas;
            const saved = await this.asignacionRepository.save(asignacionActual);
            await this.auditoriaService.registrar({
                userId: saved.userId,
                vehicleId: saved.vehicleId,
                accion: accion_auditoria_enum_js_1.AccionAuditoria.MODIFICACION,
                payload: {
                    anterior: { notas: datosAnteriores.notas },
                    nuevo: { notas: saved.notas },
                },
            });
            return saved;
        }
        return asignacionActual;
    }
    async eliminar(userId, vehicleId) {
        const asignacion = await this.asignacionRepository.findOne({
            where: { userId, vehicleId, activo: true },
        });
        if (!asignacion) {
            throw new common_1.NotFoundException(`No se encontró una asignación activa entre el usuario ${userId} y el vehículo ${vehicleId}.`);
        }
        const datosAnteriores = { ...asignacion };
        asignacion.activo = false;
        await this.asignacionRepository.save(asignacion);
        await this.auditoriaService.registrar({
            userId,
            vehicleId,
            accion: accion_auditoria_enum_js_1.AccionAuditoria.ELIMINACION,
            payload: {
                anterior: {
                    userId: datosAnteriores.userId,
                    vehicleId: datosAnteriores.vehicleId,
                    activo: true,
                    notas: datosAnteriores.notas,
                    fechaAsignacion: datosAnteriores.fechaAsignacion,
                },
                nuevo: { activo: false },
            },
        });
        return {
            message: `Asignación entre usuario ${userId} y vehículo ${vehicleId} eliminada exitosamente.`,
        };
    }
    async listarTodas() {
        return this.asignacionRepository.find({
            order: { fechaAsignacion: 'DESC' },
        });
    }
    async obtenerFlota(userId) {
        const asignaciones = await this.asignacionRepository.find({
            where: { userId, activo: true },
        });
        const vehiculosPromises = asignaciones.map(async (asignacion) => {
            const detalle = await this.vehiculoClient.obtenerDetalleVehiculo(asignacion.vehicleId);
            if (!detalle) {
                return null;
            }
            const vehiculoFlota = {
                vehicleId: asignacion.vehicleId,
                placa: detalle.plate,
                marca: detalle.brand,
                modelo: detalle.model,
                anio: detalle.year,
                color: detalle.color,
                tipo: detalle.tipo?.toUpperCase() ?? 'DESCONOCIDO',
                clasificacion: detalle.classification,
                fechaAsignacion: asignacion.fechaAsignacion,
            };
            return vehiculoFlota;
        });
        const resultados = await Promise.allSettled(vehiculosPromises);
        const vehiculos = resultados
            .filter((r) => r.status === 'fulfilled')
            .map((r) => r.value)
            .filter((v) => v !== null);
        return {
            userId,
            vehiculos,
            totalVehiculos: vehiculos.length,
        };
    }
};
exports.AsignacionService = AsignacionService;
exports.AsignacionService = AsignacionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asignacion_entity_js_1.Asignacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        vehiculo_client_service_js_1.VehiculoClientService,
        auditoria_service_js_1.AuditoriaService])
], AsignacionService);
//# sourceMappingURL=asignacion.service.js.map