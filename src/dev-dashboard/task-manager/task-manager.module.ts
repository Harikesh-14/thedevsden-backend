import { Module } from '@nestjs/common';
import { TaskManagerService } from './task-manager.service.js';
import { TaskManagerController } from './task-manager.controller.js';

@Module({
  providers: [TaskManagerService],
  controllers: [TaskManagerController]
})
export class TaskManagerModule {}
