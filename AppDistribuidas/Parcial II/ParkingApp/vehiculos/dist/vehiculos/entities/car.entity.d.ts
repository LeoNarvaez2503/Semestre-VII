import Vehicle from './vehicle.entity';
export declare class Car extends Vehicle {
    doors: number;
    trunkCapacity: number;
    fuelType: string;
    getType(): string;
}
