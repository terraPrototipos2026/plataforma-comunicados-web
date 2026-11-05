import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { DepartamentosModule } from './modules/departamentos/departamentos.module.js';
import { PermisosModule } from './modules/permisos/permisos.module.js';
import { RolesModule } from './modules/roles/roles.module.js';
import { SucursalesModule } from './modules/sucursales/sucursales.module.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    DepartamentosModule,
    PermisosModule,
    RolesModule,
    SucursalesModule,
    UsuariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
