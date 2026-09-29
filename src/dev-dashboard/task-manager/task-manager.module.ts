import { Module } from '@nestjs/common';
import { TaskManagerService } from './task-manager.service.js';
import { TaskManagerController } from './task-manager.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task-manager.schema.js';
import { AuthModule } from '../../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [TaskManagerService],
  controllers: [TaskManagerController],
})
export class TaskManagerModule {}
