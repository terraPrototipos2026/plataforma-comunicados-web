import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePermisoRequestDto {
  @ApiProperty({
    description: 'Nuevo nombre o código único del permiso',
    example: 'comunicados:publicar',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}
