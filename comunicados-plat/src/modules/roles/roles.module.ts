import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PermisosModule } from '../permisos/permisos.module.js';
import { RolesController } from './presentation/controllers/roles.controller.js';
import { CreateRolUseCase } from './application/use-cases/create-rol.use-case.js';
import { GetRolesUseCase } from './application/use-cases/get-roles.use-case.js';
import { UpdateRolUseCase } from './application/use-cases/update-rol.use-case.js';
import { AssignPermisosToRolUseCase } from './application/use-cases/assign-permisos-to-rol.use-case.js';
import { DeleteRolUseCase } from './application/use-cases/delete-rol.use-case.js';
import { ROL_REPOSITORY_TOKEN } from './infrastructure/tokens.js';
import { RolPrismaRepository } from './infrastructure/persistence/prisma/rol-prisma.repository.js';

@Module({
  imports: [AuthModule, PermisosModule],
  controllers: [RolesController],
  providers: [
    CreateRolUseCase,
    GetRolesUseCase,
    UpdateRolUseCase,
    AssignPermisosToRolUseCase,
    DeleteRolUseCase,
    {
      provide: ROL_REPOSITORY_TOKEN,
      useClass: RolPrismaRepository,
    },
  ],
  exports: [ROL_REPOSITORY_TOKEN, GetRolesUseCase],
})
export class RolesModule {}
