import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssignPermisosRequestDto {
  @ApiProperty({
    description: 'Lista completa de UUIDs de permisos a sincronizar en el rol (reemplaza la lista actual)',
    example: ['913e229a-832d-4c87-963b-6c8f53f4b100'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  permisoIds: string[];
}
