import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  IsNumber,
  IsIn,
  ValidateNested,
  Max,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Classification } from '../entities/vehicle.entity';
import { IsSafeText } from '../validators/custom-validators';

export class BaseVehicleDto {
  @ApiProperty({
    description: 'La placa del vehículo (AAA1234 o AAA123 para autos/camionetas)',
    example: 'PCG1234',
  })
  @IsString({ message: 'La placa debe ser un texto' })
  @IsNotEmpty({ message: 'La placa no puede estar vacía' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : value)
  @Matches(/^[A-Z]{3}\d{3,4}$/, {
    message: 'La placa debe contener 3 letras y 3 o 4 dígitos (ej. PBA1234)',
  })
  plate!: string;

  @ApiProperty({
    description: 'La marca del vehículo',
    example: 'Chevrolet',
  })
  @IsString({ message: 'La marca debe ser un texto' })
  @IsNotEmpty({ message: 'La marca no puede estar vacía' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsSafeText({ message: 'La marca contiene caracteres no permitidos' })
  @MinLength(2, { message: 'La marca debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'La marca debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z0-9\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'La marca solo puede contener letras, números, espacios y guiones',
  })
  brand!: string;

  @ApiProperty({
    description: 'El modelo del vehículo',
    example: 'Sail',
  })
  @IsString({ message: 'El modelo debe ser un texto' })
  @IsNotEmpty({ message: 'El modelo no puede estar vacío' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsSafeText({ message: 'El modelo contiene caracteres no permitidos' })
  @MinLength(1, { message: 'El modelo debe tener al menos 1 caracter' })
  @MaxLength(30, { message: 'El modelo debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z0-9\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El modelo solo puede contener letras, números, espacios y guiones',
  })
  model!: string;

  @ApiProperty({
    description: 'El color del vehículo',
    example: 'Rojo',
  })
  @IsString({ message: 'El color debe ser un texto' })
  @IsNotEmpty({ message: 'El color no puede estar vacío' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsSafeText({ message: 'El color contiene caracteres no permitidos' })
  @MinLength(2, { message: 'El color debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'El color debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El color solo puede contener letras, espacios y guiones',
  })
  color!: string;

  @ApiProperty({
    description: 'El año del vehículo',
    example: 2020,
  })
  @IsNumber({}, { message: 'El año debe ser un número' })
  @IsInt({ message: 'El año debe ser un número entero' })
  @IsNotEmpty({ message: 'El año no puede estar vacío' })
  @Min(1885, { message: 'El año debe ser mayor o igual a 1885' })
  @Max(new Date().getFullYear() + 1, { message: 'El año no puede ser superior a 1 año más del año actual' })
  year!: number;

  @ApiProperty({
    enum: Classification,
    description: 'La clasificación del vehículo',
    example: Classification.GASOLINA,
  })
  @IsEnum(Classification, { message: 'La clasificación debe ser un valor válido (Electrico, Hibrido, Gasolina, Diesel)' })
  @IsNotEmpty({ message: 'La clasificación no puede estar vacía' })
  classification!: Classification;
}

export class CarDto extends BaseVehicleDto {
  @ApiProperty({
    description: 'Número de puertas',
    example: 4,
  })
  @IsInt({ message: 'El número de puertas debe ser un número entero' })
  @IsNotEmpty({ message: 'El número de puertas no puede estar vacío' })
  @IsNumber({}, { message: 'El número de puertas debe ser un número' })
  @Min(2, { message: 'El número de puertas debe ser mayor o igual a 2' })
  doors!: number;

  @ApiProperty({
    description: 'Tipo de combustible',
    example: 'Super',
  })
  @IsString({ message: 'El tipo de combustible debe ser un texto' })
  @IsNotEmpty({ message: 'El tipo de combustible no puede estar vacío' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsSafeText({ message: 'El tipo de combustible contiene caracteres no permitidos' })
  @MinLength(2, {
    message: 'El tipo de combustible debe tener al menos 2 caracteres',
  })
  @MaxLength(30, {
    message: 'El tipo de combustible debe tener como máximo 30 caracteres',
  })
  @Matches(/^[a-zA-Z0-9\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El tipo de combustible solo puede contener letras, números y espacios',
  })
  fuelType!: string;

  @ApiProperty({
    description: 'Capacidad del maletero en litros',
    example: 350,
  })
  @IsNumber({}, { message: 'La capacidad del maletero debe ser un número' })
  @IsNotEmpty({ message: 'La capacidad del maletero no puede estar vacía' })
  @Min(2, { message: 'La capacidad del maletero debe ser mayor o igual a 2' })
  trunkCapacity!: number;
}

export class MotorcycleDto extends BaseVehicleDto {
  @ApiProperty({
    description: 'La placa de la motocicleta (formato AA-123A o AB-123C)',
    example: 'AB-123C',
  })
  @IsString({ message: 'La placa debe ser un texto' })
  @IsNotEmpty({ message: 'La placa no puede estar vacía' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase().replace(/\s+/g, '') : value)
  @Matches(/^[A-Z]{2,3}-?\d{3,4}[A-Z]?$/, {
    message: 'La placa de moto debe tener un formato válido (ej. AB-123C)',
  })
  declare plate: string;

  @ApiProperty({
    description: 'Tipo de motocicleta',
    example: 'Scooter',
  })
  @IsString({ message: 'El tipo debe ser un texto' })
  @IsNotEmpty({ message: 'El tipo no puede estar vacío' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsSafeText({ message: 'El tipo contiene caracteres no permitidos' })
  @MinLength(2, { message: 'El tipo debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'El tipo debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z0-9\s\/\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El tipo solo puede contener letras, números y espacios',
  })
  type!: string;
}

export class TruckDto extends BaseVehicleDto {
  @ApiProperty({
    description: 'Tipo de cabina (1: simple, 2: doble)',
    example: 2,
  })
  @IsNumber({}, { message: 'La cabina debe ser un número' })
  @IsNotEmpty({ message: 'La cabina no puede estar vacía' })
  @Min(1, { message: 'La cabina debe ser mayor o igual a 1' })
  @Max(2, { message: 'La cabina debe ser menor o igual a 2' })
  cabin!: number;

  @ApiProperty({
    description: 'Capacidad de carga en toneladas',
    example: 3.5,
  })
  @IsNumber({}, { message: 'La capacidad de carga debe ser un número' })
  @IsNotEmpty({ message: 'La capacidad de carga no puede estar vacía' })
  @Min(1, { message: 'La capacidad de carga debe ser mayor o igual a 1' })
  loadCapacity!: number;
}

@ApiExtraModels(CarDto, MotorcycleDto, TruckDto)
export class CreateVehicleDto {
  @ApiProperty({
    description: 'Tipo de vehículo',
    enum: ['Auto', 'Moto', 'Camioneta', 'auto', 'moto', 'camioneta'],
    example: 'Auto',
  })
  @IsIn(
    ['Auto', 'Moto', 'Camioneta', 'auto', 'moto', 'camioneta'],
    { message: 'El tipo de vehículo debe ser uno de los siguientes valores: Auto, Moto, Camioneta, auto, moto, camioneta' }
  )
  type!: string;

  @ApiProperty({
    description: 'Datos específicos según el tipo de vehículo',
    oneOf: [
      { $ref: getSchemaPath(CarDto) },
      { $ref: getSchemaPath(MotorcycleDto) },
      { $ref: getSchemaPath(TruckDto) },
    ],
  })
  @ValidateNested()
  @Type((opts) => {
    const object = opts?.object as CreateVehicleDto;
    if (!object) return BaseVehicleDto;

    const tipo = object.type.toLowerCase();

    switch (tipo) {
      case 'auto':
      case 'car':
        return CarDto;
      case 'moto':
      case 'motorcycle':
        return MotorcycleDto;
      case 'camioneta':
      case 'truck':
        return TruckDto;
      default:
        return BaseVehicleDto;
    }
  })
  data!: CarDto | MotorcycleDto | TruckDto;
}
