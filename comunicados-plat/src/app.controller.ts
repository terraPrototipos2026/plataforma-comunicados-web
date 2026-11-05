import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('Estado del Sistema')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check del servicio',
    description: 'Verifica que el servidor API de la Plataforma de Comunicados esté activo.',
  })
  @ApiResponse({ status: 200, description: 'Servicio operativo.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
