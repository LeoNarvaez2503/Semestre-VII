export declare enum Classification {
    ELECTRICO = "Electrico",
    HIBRIDO = "Hibrido",
    GASOLINA = "Gasolina",
    DIESEL = "Diesel"
}
export default abstract class Vehicle {
    id: string;
    plate: string;
    brand: string;
    model: string;
    color: string;
    year: number;
    classification: Classification;
    abstract getType(): string;
}
