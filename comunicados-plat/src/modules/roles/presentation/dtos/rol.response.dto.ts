import { ApiProperty } from '@nestjs/swagger';
import type { RolPermisoItem } from '../../domain/entities/rol.entity.js';

export class RolPermisoItemResponseDto {
  @ApiProperty({ example: '913e229a-832d-4c87-963b-6c8f53f4b100' })
  idPermiso: string;

  @ApiProperty({ example: 'comunicados:crear' })
  nombre: string;
}

export class RolResponseDto {
  @ApiProperty({
    description: 'Identificador UUID del rol',
    example: 'a196aacd-098b-4a56-81af-e19d9c01c99a',
  })
  idRol: string;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'administrador general',
  })
  nombre: string;

  @ApiProperty({
    description: 'Lista de permisos asignados al rol',
    type: [RolPermisoItemResponseDto],
  })
  permisos: RolPermisoItem[];

  constructor(idRol: string, nombre: string, permisos: RolPermisoItem[] = []) {
    this.idRol = idRol;
    this.nombre = nombre;
    this.permisos = permisos;
  }
}
