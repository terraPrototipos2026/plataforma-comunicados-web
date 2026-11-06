import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { NotificationsService } from '../infrastructure/notifications.service.js';
import { RegisterDeviceDto } from '../application/dtos/register-device.dto.js';
import { SendNotificationDto } from '../application/dtos/send-notification.dto.js';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('devices')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Registrar o actualizar el token FCM de un dispositivo para el usuario autenticado',
  })
  @ApiBody({ type: RegisterDeviceDto })
  @ApiResponse({ status: 200, description: 'Dispositivo registrado exitosamente' })
  async registerDevice(
    @Body() dto: RegisterDeviceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const idUsuario = req.user?.sub;
    if (!idUsuario) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }
    return this.notificationsService.registerDevice(idUsuario, dto);
  }

  @Delete('devices/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desvincular un token FCM del usuario autenticado (ej: al cerrar sesión)',
  })
  @ApiParam({ name: 'token', description: 'Token FCM a desvincular' })
  @ApiResponse({ status: 200, description: 'Dispositivo desvinculado' })
  async unregisterDevice(
    @Param('token') token: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const idUsuario = req.user?.sub;
    if (!idUsuario) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }
    return this.notificationsService.unregisterDevice(idUsuario, token);
  }

  @Get('devices')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar los dispositivos registrados del usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos' })
  async getMyDevices(@Req() req: AuthenticatedRequest) {
    const idUsuario = req.user?.sub;
    if (!idUsuario) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }
    return this.notificationsService.getUserDevices(idUsuario);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener el historial de notificaciones y comunicados para el usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Historial de notificaciones con métricas de lectura' })
  async getHistory(@Req() req: AuthenticatedRequest) {
    const idUsuario = req.user?.sub;
    return this.notificationsService.getHistory(idUsuario);
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar una notificación push a un usuario específico en todos sus dispositivos (Exclusivo Administrador)',
  })
  @ApiBody({ type: SendNotificationDto })
  @ApiResponse({ status: 200, description: 'Resultado del envío push' })
  async sendNotification(
    @Body() dto: SendNotificationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const rol = req.user?.rol?.toLowerCase() ?? '';
    const esAdmin = rol.includes('admin') || rol.includes('gerent');
    if (!esAdmin) {
      throw new ForbiddenException('Acceso restringido: Solo roles administrativos pueden emitir notificaciones push directas.');
    }

    return this.notificationsService.sendToUser(
      dto.userId,
      dto.title,
      dto.body,
      dto.url,
    );
  }
}
