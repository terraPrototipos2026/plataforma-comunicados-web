import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateDepartamentoRequestDto {
  @ApiProperty({
    description: 'Nuevo nombre único para el departamento',
    example: 'talento humano',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}
