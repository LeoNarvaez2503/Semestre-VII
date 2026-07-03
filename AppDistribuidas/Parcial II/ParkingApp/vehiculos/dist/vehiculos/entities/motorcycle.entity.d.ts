import Vehicle from './vehicle.entity';
export declare enum MotorcycleType {
    DEPORTIVA = "Deportiva",
    SCOOTER = "Scooter",
    MOTOCROSS = "Motocross"
}
export declare class Motorcycle extends Vehicle {
    motorcycleType: MotorcycleType;
    getType(): string;
}
