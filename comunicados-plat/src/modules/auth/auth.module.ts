import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { AuthService } from './application/services/auth.service.js';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard.js';
import {
  PASSWORD_HASHER_TOKEN,
  TOKEN_SERVICE_TOKEN,
  AUTH_USER_REPOSITORY_TOKEN,
  SESSION_REPOSITORY_TOKEN,
} from './infrastructure/tokens.js';
import { Argon2PasswordHasherAdapter } from './infrastructure/adapters/argon2-password-hasher.adapter.js';
import { JwtTokenServiceAdapter } from './infrastructure/adapters/jwt-token-service.adapter.js';
import { AuthUserPrismaRepository } from './infrastructure/persistence/prisma/auth-user-prisma.repository.js';
import { SessionPrismaRepository } from './infrastructure/persistence/prisma/session-prisma.repository.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret-key-change-in-production'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    {
      provide: PASSWORD_HASHER_TOKEN,
      useClass: Argon2PasswordHasherAdapter,
    },
    {
      provide: TOKEN_SERVICE_TOKEN,
      useClass: JwtTokenServiceAdapter,
    },
    {
      provide: AUTH_USER_REPOSITORY_TOKEN,
      useClass: AuthUserPrismaRepository,
    },
    {
      provide: SESSION_REPOSITORY_TOKEN,
      useClass: SessionPrismaRepository,
    },
  ],
  exports: [AuthService, JwtAuthGuard, TOKEN_SERVICE_TOKEN],
})
export class AuthModule {}

