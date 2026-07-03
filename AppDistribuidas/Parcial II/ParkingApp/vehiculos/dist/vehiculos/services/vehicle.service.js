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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vehicle_entity_1 = __importDefault(require("../entities/vehicle.entity"));
const typeorm_2 = require("typeorm");
const vehicle_factory_1 = require("../factory/vehicle.factory");
let VehicleService = class VehicleService {
    vehicleRepository;
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async create(createVehicleDto) {
        const exists = await this.vehicleRepository.findOne({
            where: {
                plate: (0, typeorm_2.ILike)(createVehicleDto.data.plate),
            },
        });
        if (exists) {
            throw new common_1.ConflictException('El vehículo ya está registrado.');
        }
        const vehicle = vehicle_factory_1.VehicleFactory.create(createVehicleDto);
        return this.vehicleRepository.save(vehicle);
    }
    async findAll() {
        return this.vehicleRepository.find();
    }
    async findOne(id) {
        const vehicle = await this.vehicleRepository.findOne({
            where: { id },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehículo no encontrado.');
        }
        return vehicle;
    }
    async update(id, updateVehicleDto) {
        const vehicle = await this.findOne(id);
        if (updateVehicleDto.data) {
            const data = updateVehicleDto.data;
            if (data.plate && data.plate !== vehicle.plate) {
                const exists = await this.vehicleRepository.findOne({
                    where: { plate: (0, typeorm_2.ILike)(data.plate) },
                });
                if (exists && exists.id !== id) {
                    throw new common_1.ConflictException('La placa ya está registrada por otro vehículo.');
                }
            }
            if (data.plate)
                vehicle.plate = data.plate;
            if (data.brand)
                vehicle.brand = data.brand;
            if (data.model)
                vehicle.model = data.model;
            if (data.color)
                vehicle.color = data.color;
            if (data.year)
                vehicle.year = data.year;
            if (data.classification)
                vehicle.classification = data.classification;
            const anyVehicle = vehicle;
            if ('doors' in data)
                anyVehicle.doors = data.doors;
            if ('trunkCapacity' in data)
                anyVehicle.trunkCapacity = data.trunkCapacity;
            if ('fuelType' in data)
                anyVehicle.fuelType = data.fuelType;
            if ('type' in data && vehicle.getType() === 'moto')
                anyVehicle.motorcycleType = data.type;
            if ('cabin' in data)
                anyVehicle.cabin = data.cabin;
            if ('loadCapacity' in data)
                anyVehicle.loadCapacity = data.loadCapacity;
        }
        return this.vehicleRepository.save(vehicle);
    }
    async remove(id) {
        const vehicle = await this.findOne(id);
        await this.vehicleRepository.remove(vehicle);
    }
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.default)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VehicleService);
//# sourceMappingURL=vehicle.service.js.map