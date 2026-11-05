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
import { CreateDepartamentoUseCase } from '../../application/use-cases/create-departamento.use-case.js';
import { GetDepartamentosUseCase } from '../../application/use-cases/get-departamentos.use-case.js';
import { UpdateDepartamentoUseCase } from '../../application/use-cases/update-departamento.use-case.js';
import { DeleteDepartamentoUseCase } from '../../application/use-cases/delete-departamento.use-case.js';
import { CreateDepartamentoRequestDto } from '../dtos/create-departamento.request.dto.js';
import { UpdateDepartamentoRequestDto } from '../dtos/update-departamento.request.dto.js';
import { DepartamentoResponseDto } from '../dtos/departamento.response.dto.js';

@ApiTags('Departamentos')
@Controller('departamentos')
export class DepartamentosController {
  constructor(
    private readonly createDepartamentoUseCase: CreateDepartamentoUseCase,
    private readonly getDepartamentosUseCase: GetDepartamentosUseCase,
    private readonly updateDepartamentoUseCase: UpdateDepartamentoUseCase,
    private readonly deleteDepartamentoUseCase: DeleteDepartamentoUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todos los departamentos',
    description: 'Retorna la lista ordenada alfabéticamente de todos los departamentos corporativos.',
  })
  @ApiResponse({ status: 200, description: 'Lista de departamentos.', type: [DepartamentoResponseDto] })
  async findAll(): Promise<DepartamentoResponseDto[]> {
    const items = await this.getDepartamentosUseCase.findAll();
    return items.map((d) => new DepartamentoResponseDto(d.idDepartamento, d.nombre, d.idSucursal));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del departamento', example: 'd3ebb34b-ad47-40c9-9f9b-d8a6653a855a' })
  @ApiOperation({
    summary: 'Obtener un departamento por UUID',
    description: 'Busca y retorna un departamento específico por su identificador único UUID.',
  })
  @ApiResponse({ status: 200, description: 'Departamento encontrado.', type: DepartamentoResponseDto })
  @ApiResponse({ status: 400, description: 'Formato de UUID inválido.' })
  @ApiResponse({ status: 404, description: 'Departamento no encontrado.' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<DepartamentoResponseDto> {
    const item = await this.getDepartamentosUseCase.findById(id);
    return new DepartamentoResponseDto(item.idDepartamento, item.nombre, item.idSucursal);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateDepartamentoRequestDto })
  @ApiOperation({
    summary: 'Crear un nuevo departamento',
    description: 'Registra un departamento corporativo verificando unicidad por nombre.',
  })
  @ApiResponse({ status: 201, description: 'Departamento creado.', type: DepartamentoResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 409, description: 'El departamento ya existe.' })
  async create(@Body() dto: CreateDepartamentoRequestDto): Promise<DepartamentoResponseDto> {
    const created = await this.createDepartamentoUseCase.execute({
      nombre: dto.nombre,
      idSucursal: dto.idSucursal,
    });
    return new DepartamentoResponseDto(created.idDepartamento, created.nombre, created.idSucursal);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del departamento', example: 'd3ebb34b-ad47-40c9-9f9b-d8a6653a855a' })
  @ApiBody({ type: UpdateDepartamentoRequestDto })
  @ApiOperation({
    summary: 'Actualizar nombre de un departamento',
    description: 'Renombra un departamento existente verificando que el nuevo nombre no esté en uso.',
  })
  @ApiResponse({ status: 200, description: 'Departamento actualizado.', type: DepartamentoResponseDto })
  @ApiResponse({ status: 400, description: 'Datos o UUID inválidos.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Departamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'El nombre ya está en uso.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDepartamentoRequestDto,
  ): Promise<DepartamentoResponseDto> {
    const updated = await this.updateDepartamentoUseCase.execute({
      idDepartamento: id,
      nombre: dto.nombre,
      idSucursal: dto.idSucursal,
    });
    return new DepartamentoResponseDto(updated.idDepartamento, updated.nombre, updated.idSucursal);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del departamento', example: 'd3ebb34b-ad47-40c9-9f9b-d8a6653a855a' })
  @ApiOperation({
    summary: 'Eliminar un departamento',
    description: 'Elimina el departamento si no cuenta con usuarios asignados.',
  })
  @ApiResponse({ status: 200, description: 'Departamento eliminado correctamente.', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Departamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'El departamento tiene usuarios asignados.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<MessageResponseDto> {
    return this.deleteDepartamentoUseCase.execute(id);
  }
}
