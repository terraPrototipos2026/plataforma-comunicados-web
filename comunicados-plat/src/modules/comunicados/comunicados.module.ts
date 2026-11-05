import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module.js';
import { ComunicadosController } from './presentation/controllers/comunicados.controller.js';
import { GetComunicadosUseCase } from './application/use-cases/get-comunicados.use-case.js';
import { GetComunicadoDetailUseCase } from './application/use-cases/get-comunicado-detail.use-case.js';
import { CreateComunicadoUseCase } from './application/use-cases/create-comunicado.use-case.js';
import { EstimarAlcanceUseCase } from './application/use-cases/estimar-alcance.use-case.js';
import { ConfirmarLecturaUseCase } from './application/use-cases/confirmar-lectura.use-case.js';
import { AnularComunicadoUseCase } from './application/use-cases/anular-comunicado.use-case.js';
import { COMUNICADO_REPOSITORY_TOKEN } from './infrastructure/tokens.js';
import { ComunicadoPrismaRepository } from './infrastructure/persistence/prisma/comunicado-prisma.repository.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ComunicadosController],
  providers: [
    GetComunicadosUseCase,
    GetComunicadoDetailUseCase,
    CreateComunicadoUseCase,
    EstimarAlcanceUseCase,
    ConfirmarLecturaUseCase,
    AnularComunicadoUseCase,
    {
      provide: COMUNICADO_REPOSITORY_TOKEN,
      useClass: ComunicadoPrismaRepository,
    },
  ],
  exports: [COMUNICADO_REPOSITORY_TOKEN],
})
export class ComunicadosModule {}

