import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioRequestDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Brayan Pérez Modificado',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico institucional o personal',
    example: 'usuario.nuevo@terra.com',
  })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiPropertyOptional({
    description: 'Número telefónico de contacto',
    example: '+591 71111111',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Nombre del rol asignado',
    example: 'administrador general',
  })
  @IsOptional()
  @IsString()
  rol?: string;

  @ApiPropertyOptional({
    description: 'Nombre del departamento al que pertenece',
    example: 'sistemas',
  })
  @IsOptional()
  @IsString()
  departamento?: string;
}

