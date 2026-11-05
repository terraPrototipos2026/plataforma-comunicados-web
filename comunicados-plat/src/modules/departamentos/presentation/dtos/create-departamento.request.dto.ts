import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}
