import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThoughtsModule } from './non-functional-req/thoughts/thoughts.module.js';
import { NewProjectsPlanModule } from './dev-dashboard/new-projects-plan/new-projects-plan.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TaskManagerModule } from './dev-dashboard/task-manager/task-manager.module.js';
import { RoadmapModule } from './dev-dashboard/roadmap/roadmap.module.js';
import { ContactMeModule } from './portfolio/contact-me/contact-me.module.js';
import { ProjectsModule } from './portfolio/projects/projects.module.js';
import { NotepadModule } from './dev-dashboard/notepad/notepad.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),

    ThoughtsModule,
    NewProjectsPlanModule,
    AuthModule,
    TaskManagerModule,
    RoadmapModule,
    ContactMeModule,
    ProjectsModule,
    NotepadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
