import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@terra.com',
  })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Secret123*',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
