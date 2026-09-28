import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NewProjectsPlan,
  NewProjectsPlanSchema,
} from './schemas/new-projects-plan.schema.js';
import { NewProjectsPlanService } from './new-projects-plan.service.js';
import { NewProjectsPlanController } from './new-projects-plan.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NewProjectsPlan.name,
        schema: NewProjectsPlanSchema,
      },
    ]),
  ],
  providers: [NewProjectsPlanService],
  controllers: [NewProjectsPlanController],
})
export class NewProjectsPlanModule {}
