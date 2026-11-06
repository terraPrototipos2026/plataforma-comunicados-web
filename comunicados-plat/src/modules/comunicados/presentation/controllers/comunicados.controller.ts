import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import * as fs from 'node:fs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../../../auth/presentation/guards/jwt-auth.guard.js';
import { GetComunicadosUseCase } from '../../application/use-cases/get-comunicados.use-case.js';
import { GetComunicadoDetailUseCase } from '../../application/use-cases/get-comunicado-detail.use-case.js';
import { CreateComunicadoUseCase } from '../../application/use-cases/create-comunicado.use-case.js';
import { EstimarAlcanceUseCase } from '../../application/use-cases/estimar-alcance.use-case.js';
import { ConfirmarLecturaUseCase } from '../../application/use-cases/confirmar-lectura.use-case.js';
import { AnularComunicadoUseCase } from '../../application/use-cases/anular-comunicado.use-case.js';
import { CreateComunicadoRequestDto } from '../dtos/create-comunicado.request.dto.js';
import { FilterComunicadosQueryDto } from '../dtos/filter-comunicados.query.dto.js';
import { EstimarAlcanceRequestDto } from '../dtos/estimar-alcance.request.dto.js';
import { ComunicadoResponseDto } from '../dtos/comunicado.response.dto.js';

@ApiTags('Comunicados')
@Controller('comunicados')
export class ComunicadosController {
  constructor(
    private readonly getComunicadosUseCase: GetComunicadosUseCase,
    private readonly getComunicadoDetailUseCase: GetComunicadoDetailUseCase,
    private readonly createComunicadoUseCase: CreateComunicadoUseCase,
    private readonly estimarAlcanceUseCase: EstimarAlcanceUseCase,
    private readonly confirmarLecturaUseCase: ConfirmarLecturaUseCase,
    private readonly anularComunicadoUseCase: AnularComunicadoUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar comunicados oficiales con filtros y métricas de lectura',
  })
  @ApiResponse({ status: 200, type: [ComunicadoResponseDto] })
  async findAll(@Query() query: FilterComunicadosQueryDto): Promise<ComunicadoResponseDto[]> {
    const list = await this.getComunicadosUseCase.execute(query);
    return list.map(ComunicadoResponseDto.fromDomain);
  }

  @Post('estimar-alcance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Estimar dotación y validar alcance jerárquico según el rol emisor',
  })
  async estimarAlcance(@Body() dto: EstimarAlcanceRequestDto) {
    return this.estimarAlcanceUseCase.execute(dto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Subir archivo institucional (imagen o PDF)',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (
          _req: unknown,
          _file: unknown,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          const uploadDir = './uploads';
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (
          _req: unknown,
          file: { originalname: string },
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          cb(null, `${uniqueSuffix}-${safeName}`);
        },
      }),
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  uploadFile(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo para subir.');
    }

    const host = process.env.API_BASE_URL || 'http://localhost:3000';
    const fileUrl = `${host}/uploads/${file.filename}`;

    return {
      url: fileUrl,
      nombreOriginal: file.originalname,
      tamanoBytes: file.size,
      mimetype: file.mimetype,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del comunicado' })
  @ApiOperation({
    summary: 'Obtener detalle completo de un comunicado',
  })
  @ApiResponse({ status: 200, type: ComunicadoResponseDto })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ComunicadoResponseDto> {
    const item = await this.getComunicadoDetailUseCase.execute(id);
    return ComunicadoResponseDto.fromDomain(item);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateComunicadoRequestDto })
  @ApiOperation({
    summary: 'Emitir un nuevo comunicado oficial (Modalidad EXPRESS o AVANZADO)',
  })
  @ApiResponse({ status: 201, type: ComunicadoResponseDto })
  async create(
    @Body() dto: CreateComunicadoRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ComunicadoResponseDto> {
    const idAutor = req.user?.sub;
    const rolEmisor = dto.rolSimulado ?? req.user?.rol;

    if (!idAutor) {
      throw new Error('Usuario autenticado no identificado.');
    }

    const created = await this.createComunicadoUseCase.execute({
      ...dto,
      idAutor,
      rolEmisor,
    });
    return ComunicadoResponseDto.fromDomain(created);
  }

  @Patch(':id/lectura')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del comunicado' })
  @ApiOperation({
    summary: 'Registrar visualización o confirmación obligatoria de lectura',
  })
  async registrarLectura(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { confirmar?: boolean },
    @Req() req: AuthenticatedRequest,
  ) {
    const idUsuario = req.user?.sub;
    if (!idUsuario) {
      throw new Error('Usuario autenticado no identificado.');
    }
    return this.confirmarLecturaUseCase.execute(id, idUsuario, body?.confirmar ?? true);
  }

  @Patch(':id/anular')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'UUID del comunicado' })
  @ApiOperation({
    summary: 'Anular un comunicado emitido',
  })
  async anular(@Param('id', ParseUUIDPipe) id: string) {
    return this.anularComunicadoUseCase.execute(id);
  }
}
