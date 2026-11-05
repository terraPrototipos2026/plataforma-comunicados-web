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
  Post,
  Put,
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
import { CreateRolUseCase } from '../../application/use-cases/create-rol.use-case.js';
import { GetRolesUseCase } from '../../application/use-cases/get-roles.use-case.js';
import { UpdateRolUseCase } from '../../application/use-cases/update-rol.use-case.js';
import { AssignPermisosToRolUseCase } from '../../application/use-cases/assign-permisos-to-rol.use-case.js';
import { DeleteRolUseCase } from '../../application/use-cases/delete-rol.use-case.js';
import { CreateRolRequestDto } from '../dtos/create-rol.request.dto.js';
import { UpdateRolRequestDto } from '../dtos/update-rol.request.dto.js';
import { AssignPermisosRequestDto } from '../dtos/assign-permisos.request.dto.js';
import { RolResponseDto } from '../dtos/rol.response.dto.js';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createRolUseCase: CreateRolUseCase,
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly updateRolUseCase: UpdateRolUseCase,
    private readonly assignPermisosToRolUseCase: AssignPermisosToRolUseCase,
    private readonly deleteRolUseCase: DeleteRolUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todos los roles con sus permisos',
    description: 'Retorna la lista de roles junto con los permisos asignados a cada rol.',
  })
  @ApiResponse({ status: 200, description: 'Lista de roles con permisos.', type: [RolResponseDto] })
  async findAll(): Promise<RolResponseDto[]> {
    const items = await this.getRolesUseCase.findAll();
    return items.map((r) => new RolResponseDto(r.idRol, r.nombre, r.permisos));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del rol', example: 'a196aacd-098b-4a56-81af-e19d9c01c99a' })
  @ApiOperation({
    summary: 'Obtener un rol por UUID con sus permisos',
    description: 'Busca un rol específico por su UUID e incluye la lista de permisos vinculados.',
  })
  @ApiResponse({ status: 200, description: 'Rol encontrado.', type: RolResponseDto })
  @ApiResponse({ status: 400, description: 'Formato de UUID inválido.' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<RolResponseDto> {
    const item = await this.getRolesUseCase.findById(id);
    return new RolResponseDto(item.idRol, item.nombre, item.permisos);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateRolRequestDto })
  @ApiOperation({
    summary: 'Crear un nuevo rol',
    description: 'Crea un rol organizacional y opcionalmente vincula su lista inicial de permisos.',
  })
  @ApiResponse({ status: 201, description: 'Rol creado.', type: RolResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Alguno de los permisos especificados no existe.' })
  @ApiResponse({ status: 409, description: 'El rol ya existe.' })
  async create(@Body() dto: CreateRolRequestDto): Promise<RolResponseDto> {
    const created = await this.createRolUseCase.execute({
      nombre: dto.nombre,
      permisoIds: dto.permisoIds,
    });
    return new RolResponseDto(created.idRol, created.nombre, created.permisos);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del rol', example: 'a196aacd-098b-4a56-81af-e19d9c01c99a' })
  @ApiBody({ type: UpdateRolRequestDto })
  @ApiOperation({
    summary: 'Actualizar nombre de un rol',
    description: 'Actualiza el nombre de un rol existente validando unicidad.',
  })
  @ApiResponse({ status: 200, description: 'Rol actualizado.', type: RolResponseDto })
  @ApiResponse({ status: 400, description: 'Datos o UUID inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  @ApiResponse({ status: 409, description: 'El nombre de rol ya está en uso.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRolRequestDto,
  ): Promise<RolResponseDto> {
    const updated = await this.updateRolUseCase.execute({
      idRol: id,
      nombre: dto.nombre,
    });
    return new RolResponseDto(updated.idRol, updated.nombre, updated.permisos);
  }

  @Put(':id/permisos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del rol', example: 'a196aacd-098b-4a56-81af-e19d9c01c99a' })
  @ApiBody({ type: AssignPermisosRequestDto })
  @ApiOperation({
    summary: 'Asignar / sincronizar permisos de un rol',
    description: 'Reemplaza atómicamente los permisos del rol en la tabla pivote rol_permiso.',
  })
  @ApiResponse({ status: 200, description: 'Permisos sincronizados.', type: RolResponseDto })
  @ApiResponse({ status: 400, description: 'Lista de UUIDs inválida.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Rol o permiso no encontrado.' })
  async assignPermisos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermisosRequestDto,
  ): Promise<RolResponseDto> {
    const updated = await this.assignPermisosToRolUseCase.execute({
      idRol: id,
      permisoIds: dto.permisoIds,
    });
    return new RolResponseDto(updated.idRol, updated.nombre, updated.permisos);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del rol', example: 'a196aacd-098b-4a56-81af-e19d9c01c99a' })
  @ApiOperation({
    summary: 'Eliminar un rol',
    description: 'Elimina el rol siempre que no tenga usuarios asignados.',
  })
  @ApiResponse({ status: 200, description: 'Rol eliminado correctamente.', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  @ApiResponse({ status: 409, description: 'El rol tiene usuarios asignados.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<MessageResponseDto> {
    return this.deleteRolUseCase.execute(id);
  }
}
