import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard.js';
import { MessageResponseDto } from '../../../auth/presentation/dtos/auth.response.dto.js';
import { GetUsuariosUseCase } from '../../application/use-cases/get-usuarios.use-case.js';
import { UpdateUsuarioUseCase } from '../../application/use-cases/update-usuario.use-case.js';
import { DeleteUsuarioUseCase } from '../../application/use-cases/delete-usuario.use-case.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';
import { UsuarioResponseDto } from '../dtos/usuario.response.dto.js';
import { UpdateUsuarioRequestDto } from '../dtos/update-usuario.request.dto.js';

@ApiTags('Usuarios')
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsuariosController {
  constructor(
    private readonly getUsuariosUseCase: GetUsuariosUseCase,
    private readonly updateUsuarioUseCase: UpdateUsuarioUseCase,
    private readonly deleteUsuarioUseCase: DeleteUsuarioUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description: 'Retorna la lista de usuarios con sus relaciones de rol y departamento.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.', type: [UsuarioResponseDto] })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  async findAll(): Promise<UsuarioResponseDto[]> {
    const items = await this.getUsuariosUseCase.findAll();
    return items.map(
      (u: Usuario) =>
        new UsuarioResponseDto(
          u.idUsuario,
          u.nombre,
          u.correo,
          u.telefono,
          u.idRol,
          u.rolNombre,
          u.idDepartamento,
          u.departamentoNombre,
          u.createdAt,
          u.updatedAt,
        ),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del usuario', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Obtener un usuario por UUID',
    description: 'Busca y retorna un usuario específico.',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.', type: UsuarioResponseDto })
  @ApiResponse({ status: 400, description: 'UUID inválido.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<UsuarioResponseDto> {
    const u = await this.getUsuariosUseCase.findById(id);
    return new UsuarioResponseDto(
      u.idUsuario,
      u.nombre,
      u.correo,
      u.telefono,
      u.idRol,
      u.rolNombre,
      u.idDepartamento,
      u.departamentoNombre,
      u.createdAt,
      u.updatedAt,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del usuario', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiBody({ type: UpdateUsuarioRequestDto })
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Actualiza los datos personales, de rol o departamento de un usuario.',
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.', type: UsuarioResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Usuario, rol o departamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya se encuentra en uso.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUsuarioRequestDto,
  ): Promise<UsuarioResponseDto> {
    const u = await this.updateUsuarioUseCase.execute({
      idUsuario: id,
      nombre: dto.nombre,
      correo: dto.correo,
      telefono: dto.telefono,
      rol: dto.rol,
      departamento: dto.departamento,
    });

    return new UsuarioResponseDto(
      u.idUsuario,
      u.nombre,
      u.correo,
      u.telefono,
      u.idRol,
      u.rolNombre,
      u.idDepartamento,
      u.departamentoNombre,
      u.createdAt,
      u.updatedAt,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del usuario', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiOperation({
    summary: 'Eliminar un usuario',
    description: 'Elimina un usuario por su UUID.',
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente.', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<MessageResponseDto> {
    return this.deleteUsuarioUseCase.execute(id);
  }
}
