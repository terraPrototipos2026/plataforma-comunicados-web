import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PermisosController } from './presentation/controllers/permisos.controller.js';
import { CreatePermisoUseCase } from './application/use-cases/create-permiso.use-case.js';
import { GetPermisosUseCase } from './application/use-cases/get-permisos.use-case.js';
import { UpdatePermisoUseCase } from './application/use-cases/update-permiso.use-case.js';
import { DeletePermisoUseCase } from './application/use-cases/delete-permiso.use-case.js';
import { PERMISO_REPOSITORY_TOKEN } from './infrastructure/tokens.js';
import { PermisoPrismaRepository } from './infrastructure/persistence/prisma/permiso-prisma.repository.js';

@Module({
  imports: [AuthModule],
  controllers: [PermisosController],
  providers: [
    CreatePermisoUseCase,
    GetPermisosUseCase,
    UpdatePermisoUseCase,
    DeletePermisoUseCase,
    {
      provide: PERMISO_REPOSITORY_TOKEN,
      useClass: PermisoPrismaRepository,
    },
  ],
  exports: [PERMISO_REPOSITORY_TOKEN, GetPermisosUseCase],
})
export class PermisosModule {}
