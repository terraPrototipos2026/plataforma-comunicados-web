import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateRolRequestDto {
  @ApiProperty({
    description: 'Nuevo nombre único del rol',
    example: 'gerente de ventas',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;
}
