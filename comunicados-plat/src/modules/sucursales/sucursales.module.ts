import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module.js';
import { SUCURSAL_REPOSITORY_TOKEN } from './infrastructure/tokens.js';
import { SucursalPrismaRepository } from './infrastructure/persistence/prisma/sucursal-prisma.repository.js';
import { CreateSucursalUseCase } from './application/use-cases/create-sucursal.use-case.js';
import { GetSucursalesUseCase } from './application/use-cases/get-sucursales.use-case.js';
import { UpdateSucursalUseCase } from './application/use-cases/update-sucursal.use-case.js';
import { DeleteSucursalUseCase } from './application/use-cases/delete-sucursal.use-case.js';
import { SucursalesController } from './presentation/controllers/sucursales.controller.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SucursalesController],
  providers: [
    CreateSucursalUseCase,
    GetSucursalesUseCase,
    UpdateSucursalUseCase,
    DeleteSucursalUseCase,
    {
      provide: SUCURSAL_REPOSITORY_TOKEN,
      useClass: SucursalPrismaRepository,
    },
  ],
  exports: [SUCURSAL_REPOSITORY_TOKEN, GetSucursalesUseCase],
})
export class SucursalesModule {}
