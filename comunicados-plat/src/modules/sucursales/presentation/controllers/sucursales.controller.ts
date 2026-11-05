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
import type { Sucursal } from '../../domain/entities/sucursal.entity.js';
import { CreateSucursalUseCase } from '../../application/use-cases/create-sucursal.use-case.js';
import { GetSucursalesUseCase } from '../../application/use-cases/get-sucursales.use-case.js';
import { UpdateSucursalUseCase } from '../../application/use-cases/update-sucursal.use-case.js';
import { DeleteSucursalUseCase } from '../../application/use-cases/delete-sucursal.use-case.js';
import { CreateSucursalRequestDto } from '../dtos/create-sucursal.request.dto.js';
import { UpdateSucursalRequestDto } from '../dtos/update-sucursal.request.dto.js';
import { SucursalResponseDto } from '../dtos/sucursal.response.dto.js';

@ApiTags('Sucursales')
@Controller('sucursales')
export class SucursalesController {
  constructor(
    private readonly createSucursalUseCase: CreateSucursalUseCase,
    private readonly getSucursalesUseCase: GetSucursalesUseCase,
    private readonly updateSucursalUseCase: UpdateSucursalUseCase,
    private readonly deleteSucursalUseCase: DeleteSucursalUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todas las sucursales',
    description: 'Retorna la lista de todas las sucursales corporativas ordenadas por nombre.',
  })
  @ApiResponse({ status: 200, description: 'Lista de sucursales.', type: [SucursalResponseDto] })
  async findAll(): Promise<SucursalResponseDto[]> {
    const items = await this.getSucursalesUseCase.findAll();
    return items.map((s: Sucursal) => new SucursalResponseDto(s.idSucursal, s.nombre, s.direccion));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID de la sucursal', example: 'b4a8e239-1662-43bb-a829-9e19ff562d98' })
  @ApiOperation({
    summary: 'Obtener una sucursal por UUID',
    description: 'Busca y retorna una sucursal específica por su identificador UUID.',
  })
  @ApiResponse({ status: 200, description: 'Sucursal encontrada.', type: SucursalResponseDto })
  @ApiResponse({ status: 400, description: 'Formato de UUID inválido.' })
  @ApiResponse({ status: 404, description: 'Sucursal no encontrada.' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<SucursalResponseDto> {
    const item = await this.getSucursalesUseCase.findById(id);
    return new SucursalResponseDto(item.idSucursal, item.nombre, item.direccion);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSucursalRequestDto })
  @ApiOperation({
    summary: 'Crear una nueva sucursal',
    description: 'Registra una nueva sucursal corporativa con nombre y dirección.',
  })
  @ApiResponse({ status: 201, description: 'Sucursal creada.', type: SucursalResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 409, description: 'La sucursal ya existe.' })
  async create(@Body() dto: CreateSucursalRequestDto): Promise<SucursalResponseDto> {
    const created = await this.createSucursalUseCase.execute({
      nombre: dto.nombre,
      direccion: dto.direccion,
    });
    return new SucursalResponseDto(created.idSucursal, created.nombre, created.direccion);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID de la sucursal', example: 'b4a8e239-1662-43bb-a829-9e19ff562d98' })
  @ApiBody({ type: UpdateSucursalRequestDto })
  @ApiOperation({
    summary: 'Actualizar una sucursal',
    description: 'Modifica el nombre y/o la dirección de una sucursal existente.',
  })
  @ApiResponse({ status: 200, description: 'Sucursal actualizada.', type: SucursalResponseDto })
  @ApiResponse({ status: 400, description: 'Datos o UUID inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Sucursal no encontrada.' })
  @ApiResponse({ status: 409, description: 'El nombre ya está en uso por otra sucursal.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSucursalRequestDto,
  ): Promise<SucursalResponseDto> {
    const updated = await this.updateSucursalUseCase.execute({
      idSucursal: id,
      nombre: dto.nombre,
      direccion: dto.direccion,
    });
    return new SucursalResponseDto(updated.idSucursal, updated.nombre, updated.direccion);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID de la sucursal', example: 'b4a8e239-1662-43bb-a829-9e19ff562d98' })
  @ApiOperation({
    summary: 'Eliminar una sucursal',
    description: 'Elimina la sucursal si no cuenta con departamentos asociados.',
  })
  @ApiResponse({ status: 200, description: 'Sucursal eliminada correctamente.', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Sucursal no encontrada.' })
  @ApiResponse({ status: 409, description: 'La sucursal tiene departamentos asociados.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<MessageResponseDto> {
    return this.deleteSucursalUseCase.execute(id);
  }
}
