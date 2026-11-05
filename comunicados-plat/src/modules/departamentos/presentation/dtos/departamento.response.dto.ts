import { ApiProperty } from '@nestjs/swagger';

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

  constructor(idDepartamento: string, nombre: string) {
    this.idDepartamento = idDepartamento;
    this.nombre = nombre;
  }
}
