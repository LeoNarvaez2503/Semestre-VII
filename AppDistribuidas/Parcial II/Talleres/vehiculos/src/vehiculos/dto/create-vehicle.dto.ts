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
import { Classification } from '../entities/vehicle.entity';
import { IsNoSpaces, IsSafeText } from '../validators/custom-validators';

export class BaseVehicleDto {
  @IsString({ message: 'La placa debe ser un texto' })
  @IsNotEmpty({ message: 'La placa no puede estar vacía' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase().replace(/\s+/g, '') : value)
  @IsNoSpaces({ message: 'La placa no puede contener espacios' })
  @Matches(/^[A-Z]{3}\d{4}$/, {
    message: 'La placa debe tener el formato AAA1234',
  })
  plate!: string;

  @IsString({ message: 'La marca debe ser un texto' })
  @IsNotEmpty({ message: 'La marca no puede estar vacía' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsNoSpaces({ message: 'La marca no puede contener espacios' })
  @IsSafeText({ message: 'La marca contiene caracteres o términos reservados no permitidos (Inyección SQL)' })
  @MinLength(2, { message: 'La marca debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'La marca debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'La marca solo puede contener letras y guiones',
  })
  brand!: string;

  @IsString({ message: 'El modelo debe ser un texto' })
  @IsNotEmpty({ message: 'El modelo no puede estar vacío' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsNoSpaces({ message: 'El modelo no puede contener espacios' })
  @IsSafeText({ message: 'El modelo contiene caracteres o términos reservados no permitidos (Inyección SQL)' })
  @MinLength(2, { message: 'El modelo debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'El modelo debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El modelo solo puede contener letras y guiones',
  })
  model!: string;

  @IsString({ message: 'El color debe ser un texto' })
  @IsNotEmpty({ message: 'El color no puede estar vacío' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsNoSpaces({ message: 'El color no puede contener espacios' })
  @IsSafeText({ message: 'El color contiene caracteres o términos reservados no permitidos (Inyección SQL)' })
  @MinLength(2, { message: 'El color debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'El color debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El color solo puede contener letras y guiones',
  })
  color!: string;

  @IsNumber({}, { message: 'El año debe ser un número' })
  @IsInt({ message: 'El año debe ser un número entero' })
  @IsNotEmpty({ message: 'El año no puede estar vacío' })
  @Min(1885, { message: 'El año debe ser mayor o igual a 1885' })
  year!: number;

  @IsEnum(Classification, { message: 'La clasificación debe ser un valor válido (Electrico, Hibrido, Gasolina, Diesel)' })
  @IsNotEmpty({ message: 'La clasificación no puede estar vacía' })
  classification!: Classification;
}

export class CarDto extends BaseVehicleDto {
  @IsInt({ message: 'El número de puertas debe ser un número entero' })
  @IsNotEmpty({ message: 'El número de puertas no puede estar vacío' })
  @IsNumber({}, { message: 'El número de puertas debe ser un número' })
  @Min(2, { message: 'El número de puertas debe ser mayor o igual a 2' })
  doors!: number;

  @IsString({ message: 'El tipo de combustible debe ser un texto' })
  @IsNotEmpty({ message: 'El tipo de combustible no puede estar vacío' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsNoSpaces({ message: 'El tipo de combustible no puede contener espacios' })
  @IsSafeText({ message: 'El tipo de combustible contiene caracteres o términos reservados no permitidos (Inyección SQL)' })
  @MinLength(2, {
    message: 'El tipo de combustible debe tener al menos 2 caracteres',
  })
  @MaxLength(30, {
    message: 'El tipo de combustible debe tener como máximo 30 caracteres',
  })
  @Matches(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El tipo de combustible solo puede contener letras y guiones',
  })
  fuelType!: string;

  @IsNumber({}, { message: 'La capacidad del maletero debe ser un número' })
  @IsNotEmpty({ message: 'La capacidad del maletero no puede estar vacía' })
  @Min(2, { message: 'La capacidad del maletero debe ser mayor o igual a 2' })
  trunkCapacity!: number;
}

export class MotorcycleDto extends BaseVehicleDto {
  @IsString({ message: 'La placa debe ser un texto' })
  @IsNotEmpty({ message: 'La placa no puede estar vacía' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase().replace(/\s+/g, '') : value)
  @IsNoSpaces({ message: 'La placa no puede contener espacios' })
  @Matches(/^[A-Z]{2}-\d{3}[A-Z]{1}$/, {
    message: 'La placa debe tener el formato AA-123A',
  })
  declare plate: string;

  @IsString({ message: 'El tipo debe ser un texto' })
  @IsNotEmpty({ message: 'El tipo no puede estar vacío' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
  @IsNoSpaces({ message: 'El tipo no puede contener espacios' })
  @IsSafeText({ message: 'El tipo contiene caracteres o términos reservados no permitidos (Inyección SQL)' })
  @MinLength(2, { message: 'El tipo debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'El tipo debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El tipo solo puede contener letras y guiones',
  })
  type!: string;
}

export class TruckDto extends BaseVehicleDto {
  @IsNumber({}, { message: 'La cabina debe ser un número' })
  @IsNotEmpty({ message: 'La cabina no puede estar vacía' })
  @Min(1, { message: 'La cabina debe ser mayor o igual a 1' })
  @Max(2, { message: 'La cabina debe ser menor o igual a 2' })
  cabin!: number;

  @IsNumber({}, { message: 'La capacidad de carga debe ser un número' })
  @IsNotEmpty({ message: 'La capacidad de carga no puede estar vacía' })
  @Min(1, { message: 'La capacidad de carga debe ser mayor o igual a 1' })
  loadCapacity!: number;
}

export class CreateVehicleDto {
  @IsIn(
    ['Auto', 'Moto', 'Camioneta', 'auto', 'moto', 'camioneta'],
    { message: 'El tipo de vehículo debe ser uno de los siguientes valores: Auto, Moto, Camioneta, auto, moto, camioneta' }
  )
  type!: string;

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
