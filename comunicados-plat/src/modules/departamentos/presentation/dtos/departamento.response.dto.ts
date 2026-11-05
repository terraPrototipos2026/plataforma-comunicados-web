import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepartamentoResponseDto {
  @ApiProperty({
    description: 'Identificador UUID del departamento',
    example: 'd3ebb34b-ad47-40c9-9f9b-d8a6653a855a',
  })
  idDepartamento: string;

  @ApiProperty({
    description: 'Nombre del departamento',
    example: 'sistemas',
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Identificador UUID de la sucursal a la que pertenece',
    example: 'b4a8e239-1662-43bb-a829-9e19ff562d98',
    nullable: true,
  })
  idSucursal: string | null;

  constructor(idDepartamento: string, nombre: string, idSucursal: string | null = null) {
    this.idDepartamento = idDepartamento;
    this.nombre = nombre;
    this.idSucursal = idSucursal;
  }
}
