import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateDepartamentoRequestDto {
  @ApiProperty({
    description: 'Nombre único del departamento corporativo',
    example: 'recursos humanos',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({
    description: 'Identificador UUID de la sucursal a la que pertenece el departamento',
    example: 'b4a8e239-1662-43bb-a829-9e19ff562d98',
  })
  @IsOptional()
  @IsUUID('4')
  idSucursal?: string;
}
