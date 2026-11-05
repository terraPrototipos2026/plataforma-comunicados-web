import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module.js';
import { UsuariosController } from './presentation/controllers/usuarios.controller.js';
import { GetUsuariosUseCase } from './application/use-cases/get-usuarios.use-case.js';
import { UpdateUsuarioUseCase } from './application/use-cases/update-usuario.use-case.js';
import { DeleteUsuarioUseCase } from './application/use-cases/delete-usuario.use-case.js';
import { USUARIO_REPOSITORY_TOKEN } from './infrastructure/tokens.js';
import { UsuarioPrismaRepository } from './infrastructure/persistence/prisma/usuario-prisma.repository.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [UsuariosController],
  providers: [
    GetUsuariosUseCase,
    UpdateUsuarioUseCase,
    DeleteUsuarioUseCase,
    {
      provide: USUARIO_REPOSITORY_TOKEN,
      useClass: UsuarioPrismaRepository,
    },
  ],
  exports: [USUARIO_REPOSITORY_TOKEN, GetUsuariosUseCase],
})
export class UsuariosModule {}

