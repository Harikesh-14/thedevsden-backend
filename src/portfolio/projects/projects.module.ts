import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema.js';
import { ProjectsService } from './projects.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema }
    ])
  ],
  providers: [ProjectsService]
})
export class ProjectsModule { }
