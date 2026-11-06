import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsService } from './infrastructure/notifications.service.js';
import { NotificationsController } from './presentation/notifications.controller.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

