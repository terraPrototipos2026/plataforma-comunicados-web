import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePermisoRequestDto {
  @ApiProperty({
    description: 'Nombre o código único del permiso',
    example: 'comunicados:crear',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}
