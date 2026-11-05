import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSucursalRequestDto {
  @ApiProperty({
    description: 'Nombre de la sucursal',
    example: 'Sucursal Miraflores',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    description: 'Dirección física de la sucursal',
    example: 'Av. Arce esq. Cordero #241',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  direccion: string;
}
