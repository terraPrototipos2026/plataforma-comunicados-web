import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateRolRequestDto {
  @ApiProperty({
    description: 'Nombre único del rol en la organización',
    example: 'supervisor de sucursal',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @ApiPropertyOptional({
    description: 'Lista opcional de UUIDs de permisos iniciales a asignar al rol',
    example: ['913e229a-832d-4c87-963b-6c8f53f4b100'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permisoIds?: string[];
}
