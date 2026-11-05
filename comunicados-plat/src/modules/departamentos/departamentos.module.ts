import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DepartamentosController } from './presentation/controllers/departamentos.controller.js';
import { CreateDepartamentoUseCase } from './application/use-cases/create-departamento.use-case.js';
import { GetDepartamentosUseCase } from './application/use-cases/get-departamentos.use-case.js';
import { UpdateDepartamentoUseCase } from './application/use-cases/update-departamento.use-case.js';
import { DeleteDepartamentoUseCase } from './application/use-cases/delete-departamento.use-case.js';
import { DEPARTAMENTO_REPOSITORY_TOKEN } from './infrastructure/tokens.js';
import { DepartamentoPrismaRepository } from './infrastructure/persistence/prisma/departamento-prisma.repository.js';

@Module({
  imports: [AuthModule],
  controllers: [DepartamentosController],
  providers: [
    CreateDepartamentoUseCase,
    GetDepartamentosUseCase,
    UpdateDepartamentoUseCase,
    DeleteDepartamentoUseCase,
    {
      provide: DEPARTAMENTO_REPOSITORY_TOKEN,
      useClass: DepartamentoPrismaRepository,
    },
  ],
  exports: [DEPARTAMENTO_REPOSITORY_TOKEN, GetDepartamentosUseCase],
})
export class DepartamentosModule {}
