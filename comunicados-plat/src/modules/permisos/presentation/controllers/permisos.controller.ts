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
import { CreatePermisoUseCase } from '../../application/use-cases/create-permiso.use-case.js';
import { GetPermisosUseCase } from '../../application/use-cases/get-permisos.use-case.js';
import { UpdatePermisoUseCase } from '../../application/use-cases/update-permiso.use-case.js';
import { DeletePermisoUseCase } from '../../application/use-cases/delete-permiso.use-case.js';
import { CreatePermisoRequestDto } from '../dtos/create-permiso.request.dto.js';
import { UpdatePermisoRequestDto } from '../dtos/update-permiso.request.dto.js';
import { PermisoResponseDto } from '../dtos/permiso.response.dto.js';

@ApiTags('Permisos')
@Controller('permisos')
export class PermisosController {
  constructor(
    private readonly createPermisoUseCase: CreatePermisoUseCase,
    private readonly getPermisosUseCase: GetPermisosUseCase,
    private readonly updatePermisoUseCase: UpdatePermisoUseCase,
    private readonly deletePermisoUseCase: DeletePermisoUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todos los permisos',
    description: 'Retorna el catálogo completo de permisos registrados en el sistema.',
  })
  @ApiResponse({ status: 200, description: 'Catálogo de permisos.', type: [PermisoResponseDto] })
  async findAll(): Promise<PermisoResponseDto[]> {
    const items = await this.getPermisosUseCase.findAll();
    return items.map((p) => new PermisoResponseDto(p.idPermiso, p.nombre));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del permiso', example: '913e229a-832d-4c87-963b-6c8f53f4b100' })
  @ApiOperation({
    summary: 'Obtener un permiso por UUID',
    description: 'Busca y retorna un permiso específico por su identificador UUID.',
  })
  @ApiResponse({ status: 200, description: 'Permiso encontrado.', type: PermisoResponseDto })
  @ApiResponse({ status: 400, description: 'Formato de UUID inválido.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<PermisoResponseDto> {
    const item = await this.getPermisosUseCase.findById(id);
    return new PermisoResponseDto(item.idPermiso, item.nombre);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreatePermisoRequestDto })
  @ApiOperation({
    summary: 'Crear un nuevo permiso',
    description: 'Registra un permiso granular verificando unicidad por nombre.',
  })
  @ApiResponse({ status: 201, description: 'Permiso creado.', type: PermisoResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 409, description: 'El permiso ya existe.' })
  async create(@Body() dto: CreatePermisoRequestDto): Promise<PermisoResponseDto> {
    const created = await this.createPermisoUseCase.execute({ nombre: dto.nombre });
    return new PermisoResponseDto(created.idPermiso, created.nombre);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del permiso', example: '913e229a-832d-4c87-963b-6c8f53f4b100' })
  @ApiBody({ type: UpdatePermisoRequestDto })
  @ApiOperation({
    summary: 'Actualizar nombre de un permiso',
    description: 'Modifica el código/nombre de un permiso existente validando unicidad.',
  })
  @ApiResponse({ status: 200, description: 'Permiso actualizado.', type: PermisoResponseDto })
  @ApiResponse({ status: 400, description: 'Datos o UUID inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  @ApiResponse({ status: 409, description: 'El nombre ya está en uso.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermisoRequestDto,
  ): Promise<PermisoResponseDto> {
    const updated = await this.updatePermisoUseCase.execute({
      idPermiso: id,
      nombre: dto.nombre,
    });
    return new PermisoResponseDto(updated.idPermiso, updated.nombre);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del permiso', example: '913e229a-832d-4c87-963b-6c8f53f4b100' })
  @ApiOperation({
    summary: 'Eliminar un permiso',
    description: 'Elimina el permiso y limpia en cascada sus vínculos en rol_permiso.',
  })
  @ApiResponse({ status: 200, description: 'Permiso eliminado correctamente.', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<MessageResponseDto> {
    return this.deletePermisoUseCase.execute(id);
  }
}
