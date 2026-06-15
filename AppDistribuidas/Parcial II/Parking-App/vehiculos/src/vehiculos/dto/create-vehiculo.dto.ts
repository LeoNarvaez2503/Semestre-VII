import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, isInt, IsNotEmpty, IsNumber, IsString, Matches, Max, maxLength, MaxLength, Min, minLength, MinLength, ValidateNested } from "class-validator";
import { Clasificacion } from "../entities/vehiculo.entity";
import { TipoMoto } from "../entities/motocicleta.entity";

class BaseVehiculoDto {

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z]{3}-\d{4}$/, 
        { message: 'La placa debe tener un formato válido (ej. ABC-1234)',
     })
    placa!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2, 
        { message: 'La marca debe tener al menos 2 caracteres',
    })
    @MaxLength(30, 
        { message: 'La marca no puede tener más de 30 caracteres',
    })
    @Matches(/^[a-zA-Z\s\-áéíóúÁÉÍÓÚñÑ]+$/, {
        message: 'La marca solo puede contener letras, espacios',
    })
    marca!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2, {
        message: 'La marca debe tener al menos 2 caracteres',
    })
    @MaxLength(150, {
        message: 'La marca no puede tener más de 150 caracteres',
    })
    @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-]+$/, {
        message: 'El modelo solo puede contener letras, números, espacios',
    })
    modelo!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, {
        message: 'El color debe tener al menos 4 letras',
    })
    @MaxLength(10, {
        message: 'El color no puede tener más de 10 letras',
    })
    color!: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1885, {
        message: 'El año debe ser mayor o igual a 1885',
    })
    @Max(new Date().getFullYear() + 1, {
        message: `El año no puede ser mayor a ${new Date().getFullYear() + 1}`,
    })
    @IsInt({ message: 'El año debe ser un número entero' })
    anio!: number;

    @IsEnum(Clasificacion, { message: 'La clasificación debe ser un valor válido' })
    @IsNotEmpty()
    clasificacion!: Clasificacion;

}

class AutoDto extends BaseVehiculoDto {

    @IsInt( { message: 'El número de puertas debe ser un número entero' })
    @IsNotEmpty()
    @Min(2, {
        message: 'El número de puertas debe ser al menos 2',
    })
    @Max(5, {
        message: 'El número de puertas no puede ser mayor a 5',
    })
    numeroPuertas!: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(4, {
        message: 'El tipo de combustible debe tener al menos 4 caracteres',
    })
    @MaxLength(10, {
        message: 'El tipo de combustible no puede tener más de 10 caracteres',
    })
    tipoCombustible!: string;
}

class MotocicletaDto extends BaseVehiculoDto {

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z]{2}-\d{3}^[A-Z]$/,
        { message: 'La placa debe tener un formato válido (ej. AC-123A)',
    })
    declare placa:string;

    @IsEnum(TipoMoto, { message: 'El tipo de moto debe ser un valor válido' })
    @IsNotEmpty()
    tipoMoto!: TipoMoto;

    @IsNumber()
    @IsNotEmpty()
    @Min(50, { message: 'El cilindraje debe ser al menos 50cc' })
    cilindraje!: number;
}

class CamionetaDto extends BaseVehiculoDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1, {
        message: 'El tipo de cabina debe tener al menos 1 caracter',
    })
    @MaxLength(2, {
        message: 'El tipo de cabina no puede tener más de 2 caracteres',
    })
    cabina!: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0.1, {
        message: 'La capacidad de carga debe ser al menos 0.1 toneladas',
    })
    @Max(5, {
        message: 'La capacidad de carga no puede ser mayor a 5 toneladas',
    })
    capacidadCarga!: number;
}


export class CreateVehiculoDto {
    @IsIn(['Auto', 'Moto', 'Camioneta'])
    tipo!: string;

    @ValidateNested()
    @Type((opts) => {
        const object = opts?.object as CreateVehiculoDto;
        if (!object) return BaseVehiculoDto;

        switch (object.tipo) {
        case 'Auto':
            return AutoDto;
        case 'Moto':
            return MotocicletaDto;
        case 'Camioneta':
            return CamionetaDto;
        default:
            return BaseVehiculoDto;
        }
    })
    datos!: AutoDto | MotocicletaDto | CamionetaDto;
}
