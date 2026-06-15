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
} from 'class-validator';
import { Type } from 'class-transformer';

class BaseVehiculoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}\d{4}$/, {
    message: 'La placa debe tener el formato AAA1234',
  })
  placa!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'La marca debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'La marca debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'La marca solo puede contener letras, espacios y guiones',
  })
  marca!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El modelo debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'El modelo debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El modelo solo puede contener letras, espacios y guiones',
  })
  modelo!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El color debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'El color debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El color solo puede contener letras, espacios y guiones',
  })
  color!: string;

  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  @Min(1885, { message: 'El año debe se mayor o igual a 1885' })
  anio!: number;
}

class AutoDto extends BaseVehiculoDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  @Min(2, { message: 'El número de puertas debe ser mayor o igual a 2' })
  puertas!: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'El tipo de combustible debe tener al menos 2 caracteres',
  })
  @MaxLength(30, {
    message: 'El tipo de combustible debe tener como máximo 30 caracteres',
  })
  @Matches(/^[a-zA-Z\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: '',
  })
  tipoCombustible!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(2, { message: 'La capacidad del maletero debe ser mayor o igual a 2' })
  capacidadMaletero!: number;
}

class MotoDto extends BaseVehiculoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}-\d{3}[A-Z]{1}$/, {
    message: 'La placa debe tener el formato AAA-123A',
  })
  declare placa: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El tipo debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'El tipo debe tener como máximo 30 caracteres' })
  @Matches(/^[a-zA-Z\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'El tipo solo puede contener letras, espacios y guiones',
  })
  tipoMoto!: string;
}

class CamionetaDto extends BaseVehiculoDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'La cabina debe ser mayor o igual a 1' })
  @Max(2, { message: 'La cabina debe ser menor o igual a 2' })
  cabina!: number;
}
export class CreateVehiculoDto {
  @IsIn(['Auto', 'Moto', 'Camioneta', 'auto', 'moto', 'camioneta'])
  tipo!: string;

  @ValidateNested()
  @Type((opts) => {
    const object = opts?.object as CreateVehiculoDto;
    if (!object) return BaseVehiculoDto;

    const tipo = object.tipo.toLowerCase();

    switch (tipo) {
      case 'auto':
        return AutoDto;
      case 'moto':
        return MotoDto;
      case 'camioneta':
        return CamionetaDto;
      default:
        return BaseVehiculoDto;
    }
  })
  datos!: AutoDto | MotoDto | CamionetaDto;
}
