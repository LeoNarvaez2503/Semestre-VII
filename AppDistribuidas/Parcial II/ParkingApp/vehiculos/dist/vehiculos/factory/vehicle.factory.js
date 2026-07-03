"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleFactory = void 0;
const car_entity_1 = require("../entities/car.entity");
const motorcycle_entity_1 = require("../entities/motorcycle.entity");
const truck_entity_1 = require("../entities/truck.entity");
class VehicleFactory {
    static create(dto) {
        const type = dto.type.toLowerCase();
        switch (type) {
            case 'auto':
            case 'car': {
                const car = new car_entity_1.Car();
                const d = dto.data;
                car.plate = d.plate;
                car.brand = d.brand;
                car.model = d.model;
                car.color = d.color;
                car.year = d.year;
                car.classification = d.classification;
                car.doors = d.doors;
                car.fuelType = d.fuelType;
                car.trunkCapacity = d.trunkCapacity;
                return car;
            }
            case 'moto':
            case 'motorcycle': {
                const moto = new motorcycle_entity_1.Motorcycle();
                const d = dto.data;
                moto.plate = d.plate;
                moto.brand = d.brand;
                moto.model = d.model;
                moto.color = d.color;
                moto.year = d.year;
                moto.classification = d.classification;
                moto.motorcycleType = d.type;
                return moto;
            }
            case 'camioneta':
            case 'truck': {
                const truck = new truck_entity_1.Truck();
                const d = dto.data;
                truck.plate = d.plate;
                truck.brand = d.brand;
                truck.model = d.model;
                truck.color = d.color;
                truck.year = d.year;
                truck.classification = d.classification;
                truck.cabin = d.cabin;
                truck.loadCapacity = d.loadCapacity;
                return truck;
            }
            default:
                throw new Error(`Vehicle type not supported: ${dto.type}`);
        }
    }
}
exports.VehicleFactory = VehicleFactory;
//# sourceMappingURL=vehicle.factory.js.map