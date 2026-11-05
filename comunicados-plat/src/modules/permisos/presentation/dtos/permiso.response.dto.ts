import { ApiProperty } from '@nestjs/swagger';

export class PermisoResponseDto {
  @ApiProperty({
    description: 'Identificador UUID del permiso',
    example: '913e229a-832d-4c87-963b-6c8f53f4b100',
  })
  idPermiso: string;

  @ApiProperty({
    description: 'Nombre o código único del permiso',
    example: 'comunicados:crear',
  })
  nombre: string;

  constructor(idPermiso: string, nombre: string) {
    this.idPermiso = idPermiso;
    this.nombre = nombre;
  }
}
