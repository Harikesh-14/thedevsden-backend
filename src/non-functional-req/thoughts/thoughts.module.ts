import { Module } from '@nestjs/common';
import { ThoughtsController } from './thoughts.controller.js';
import { ThoughtsService } from './thoughts.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Thoughts, ThoughtsSchema } from './schemas/thoughts.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Thoughts.name,
        schema: ThoughtsSchema,
      },
    ]),
  ],
  controllers: [ThoughtsController],
  providers: [ThoughtsService],
})
export class ThoughtsModule {}
