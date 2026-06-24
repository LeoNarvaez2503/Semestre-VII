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
var VehiculoClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiculoClientService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let VehiculoClientService = VehiculoClientService_1 = class VehiculoClientService {
    configService;
    logger = new common_1.Logger(VehiculoClientService_1.name);
    usuariosApiUrl;
    vehiculosApiUrl;
    constructor(configService) {
        this.configService = configService;
        this.usuariosApiUrl = this.configService.get('USUARIOS_API_URL', 'http://usuarios-api:8000');
        this.vehiculosApiUrl = this.configService.get('VEHICULOS_API_URL', 'http://vehiculos-app:3000');
    }
    async validarUsuario(userId) {
        try {
            const response = await fetch(`${this.usuariosApiUrl}/usuarios/internal/validar/${userId}`);
            if (!response.ok) {
                this.logger.error(`Error al validar usuario ${userId}: HTTP ${response.status}`);
                return { exists: false };
            }
            return await response.json();
        }
        catch (error) {
            this.logger.error(`No se pudo conectar con el servicio de usuarios: ${error}`);
            throw new Error('No se pudo comunicar con el servicio de usuarios.');
        }
    }
    async validarVehiculo(vehicleId) {
        try {
            const response = await fetch(`${this.vehiculosApiUrl}/vehiculos/internal/validar/${vehicleId}`);
            if (!response.ok) {
                this.logger.error(`Error al validar vehículo ${vehicleId}: HTTP ${response.status}`);
                return { exists: false };
            }
            return await response.json();
        }
        catch (error) {
            this.logger.error(`No se pudo conectar con el servicio de vehículos: ${error}`);
            throw new Error('No se pudo comunicar con el servicio de vehículos.');
        }
    }
    async obtenerDetalleVehiculo(vehicleId) {
        try {
            const response = await fetch(`${this.vehiculosApiUrl}/vehiculos/obtener/${vehicleId}`);
            if (!response.ok) {
                this.logger.warn(`Vehículo ${vehicleId} no encontrado en el servicio de vehículos: HTTP ${response.status}`);
                return null;
            }
            return await response.json();
        }
        catch (error) {
            this.logger.error(`Error al obtener detalle del vehículo ${vehicleId}: ${error}`);
            return null;
        }
    }
};
exports.VehiculoClientService = VehiculoClientService;
exports.VehiculoClientService = VehiculoClientService = VehiculoClientService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VehiculoClientService);
//# sourceMappingURL=vehiculo-client.service.js.map