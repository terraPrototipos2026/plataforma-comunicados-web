import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({
    description: 'FCM Device Registration Token generado por el navegador o dispositivo móvil',
    example: 'f1a2b3c4d5e6...FCM_TOKEN...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Plataforma del cliente (web, android o ios)',
    example: 'web',
    enum: ['web', 'android', 'ios'],
    default: 'web',
  })
  @IsIn(['web', 'android', 'ios'])
  platform: 'web' | 'android' | 'ios';
}

