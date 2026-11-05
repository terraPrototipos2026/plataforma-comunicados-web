import { ApiProperty } from '@nestjs/swagger';

export class SucursalResponseDto {
  @ApiProperty({
    description: 'Identificador UUID de la sucursal',
    example: 'b4a8e239-1662-43bb-a829-9e19ff562d98',
  })
  idSucursal: string;

  @ApiProperty({
    description: 'Nombre de la sucursal',
    example: 'sucursal central',
  })
  nombre: string;

  @ApiProperty({
    description: 'Dirección física de la sucursal',
    example: 'Av. 6 de Agosto #1234',
  })
  direccion: string;

  constructor(idSucursal: string, nombre: string, direccion: string) {
    this.idSucursal = idSucursal;
    this.nombre = nombre;
    this.direccion = direccion;
  }
}
