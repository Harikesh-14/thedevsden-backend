import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThoughtsModule } from './non-functional-req/thoughts/thoughts.module.js';
import { NewProjectsPlanModule } from './dev-dashboard/new-projects-plan/new-projects-plan.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI')
      })
    }),

    ThoughtsModule,

    NewProjectsPlanModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
