import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UsuarioResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  idUsuario: string;

  @ApiProperty({ example: 'Brayan Pérez' })
  nombre: string;

  @ApiProperty({ example: 'usuario@terra.com' })
  correo: string;

  @ApiPropertyOptional({ example: '+591 70000000' })
  telefono: string | null;

  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  idRol: string;

  @ApiProperty({ example: 'administrador general' })
  rol: string;

  @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  idDepartamento: string;

  @ApiProperty({ example: 'sistemas' })
  departamento: string;

  @ApiProperty({ example: '2026-11-05T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-11-05T12:00:00.000Z' })
  updatedAt: string;

  constructor(
    idUsuario: string,
    nombre: string,
    correo: string,
    telefono: string | null,
    idRol: string,
    rol: string,
    idDepartamento: string,
    departamento: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.idUsuario = idUsuario;
    this.nombre = nombre;
    this.correo = correo;
    this.telefono = telefono;
    this.idRol = idRol;
    this.rol = rol;
    this.idDepartamento = idDepartamento;
    this.departamento = departamento;
    this.createdAt = createdAt.toISOString();
    this.updatedAt = updatedAt.toISOString();
  }
}

