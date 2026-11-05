import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'UUID generado para el nuevo usuario',
    example: 'b5143f61-f93d-4728-8483-b4538cfd0100',
  })
  idUsuario: string;

  @ApiProperty({
    description: 'Correo electrónico registrado',
    example: 'usuario@terra.com',
  })
  correo: string;
}

export class AuthenticatedUserDto {
  @ApiProperty({
    description: 'UUID del usuario autenticado',
    example: 'b5143f61-f93d-4728-8483-b4538cfd0100',
  })
  idUsuario: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Administrador General',
  })
  nombre: string;

  @ApiProperty({
    description: 'Correo electrónico corporativo',
    example: 'admin@terra.com',
  })
  correo: string;

  @ApiProperty({
    description: 'Nombre del rol asignado',
    example: 'administrador general',
  })
  rol: string;

  @ApiProperty({
    description: 'Nombre del departamento al que pertenece',
    example: 'sistemas',
  })
  departamento: string;

  @ApiProperty({
    description: 'Lista de códigos de permisos efectivos del rol',
    example: ['comunicados:crear', 'comunicados:publicar', 'usuarios:gestionar'],
    type: [String],
  })
  permisos: string[];
}

export class AuthTokensResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT de corta duración (15 minutos)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Datos del usuario autenticado con su rol, departamento y permisos',
    type: AuthenticatedUserDto,
  })
  user: AuthenticatedUserDto;
}

export class JwtPayloadUserDto {
  @ApiProperty({
    description: 'Subject (UUID del usuario)',
    example: 'b5143f61-f93d-4728-8483-b4538cfd0100',
  })
  sub: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@terra.com',
  })
  correo: string;

  @ApiProperty({
    description: 'Nombre del rol activo',
    example: 'administrador general',
  })
  rol: string;

  @ApiProperty({
    description: 'Permisos incluidos en el token JWT',
    example: ['comunicados:crear', 'comunicados:publicar'],
    type: [String],
  })
  permisos: string[];
}

export class ProfileResponseDto {
  @ApiProperty({
    example: 'Acceso autorizado',
  })
  message: string;

  @ApiProperty({
    type: JwtPayloadUserDto,
  })
  usuario: JwtPayloadUserDto;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Mensaje descriptivo del resultado de la operación',
    example: 'Operación realizada exitosamente.',
  })
  message: string;
}
