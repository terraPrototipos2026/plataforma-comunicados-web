import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({
    description: 'UUID del usuario destinatario',
    example: 'd3ebb34b-ad47-40c9-9f9b-d8a6653a855a',
  })
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Título de la notificación push',
    example: 'Nuevo Comunicado Oficial',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Cuerpo o mensaje de la notificación push',
    example: 'Se ha emitido la circular COM-2026-090 de lectura obligatoria.',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({
    description: 'URL o ruta de redirección en el frontend al pulsar la notificación',
    example: '/dashboard',
  })
  @IsOptional()
  @IsString()
  url?: string;
}

