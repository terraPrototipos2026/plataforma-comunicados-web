import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from '../../application/services/auth.service.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard.js';
import { RegisterRequestDto } from '../dtos/register.request.dto.js';
import { LoginRequestDto } from '../dtos/login.request.dto.js';

const REFRESH_COOKIE_NAME = 'refresh_token';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description:
      'Crea un usuario con contraseña cifrada en Argon2id, buscando internamente el UUID del rol y departamento por sus nombres.',
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'El rol o departamento especificado no existe.' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya se encuentra registrado.' })
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Valida credenciales con Argon2id, genera el Access Token JWT (15m) en la respuesta y el Refresh Token (7d) persistido en BD y enviado en una cookie HttpOnly, Secure, SameSite: strict.',
  })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso. Retorna Access Token y datos de usuario.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(
    @Body() dto: LoginRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const context = {
      userAgent: req.headers['user-agent'] ?? null,
      ipAddress: req.ip || req.socket.remoteAddress || null,
    };

    const result = await this.authService.login(dto.correo, dto.password, context);

    this.setRefreshTokenCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: 'Rotar y renovar tokens de sesión',
    description:
      'Lee la cookie HttpOnly refresh_token, valida la sesión en BD, invalida/revoca la sesión anterior (rotación de tokens) y emite un nuevo par de tokens.',
  })
  @ApiResponse({ status: 200, description: 'Tokens rotados y renovados exitosamente.' })
  @ApiResponse({ status: 401, description: 'Cookie ausente o sesión inválida/expirada.' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const currentRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Cookie de refresh token no encontrada.');
    }

    const context = {
      userAgent: req.headers['user-agent'] ?? null,
      ipAddress: req.ip || req.socket.remoteAddress || null,
    };

    const result = await this.authService.refreshToken(currentRefreshToken, context);

    this.setRefreshTokenCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Marca la sesión activa como revocada en la base de datos y elimina la cookie de refresh token.',
  })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente.' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const currentRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (currentRefreshToken) {
      await this.authService.logout(currentRefreshToken);
    }

    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth',
    });

    return { message: 'Sesión cerrada exitosamente.' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado (Ruta protegida)',
    description: 'Requiere el header `Authorization: Bearer <token>`. Retorna la información extraída del JWT (id, correo, rol y lista de permisos).',
  })
  @ApiResponse({ status: 200, description: 'Perfil obtenido correctamente.' })
  @ApiResponse({ status: 401, description: 'Token no proporcionado o inválido/expirado.' })
  getProfile(@Req() req: AuthenticatedRequest) {
    return {
      message: 'Acceso autorizado',
      usuario: req.user,
    };
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SEVEN_DAYS_MS,
      path: '/auth',
    });
  }
}
