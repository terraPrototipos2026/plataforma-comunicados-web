import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Brayan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Correo electrónico único institucional o personal',
    example: 'usuario@terra.com',
  })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({
    description: 'Contraseña en texto plano (mínimo 6 caracteres)',
    example: 'Secret123*',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Número telefónico de contacto',
    example: '+591 70000000',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    description: 'Nombre del rol asignado al usuario',
    example: 'administrador general',
  })
  @IsString()
  @IsNotEmpty()
  rol: string;

  @ApiProperty({
    description: 'Nombre del departamento al que pertenece el usuario',
    example: 'sistemas',
  })
  @IsString()
  @IsNotEmpty()
  departamento: string;
}
