import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateDepartamentoRequestDto {
  @ApiPropertyOptional({
    description: 'Nuevo nombre único para el departamento',
    example: 'talento humano',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Identificador UUID de la sucursal a la que pertenece el departamento',
    example: 'b4a8e239-1662-43bb-a829-9e19ff562d98',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  idSucursal?: string | null;
}
