import { Injectable, NotFoundException } from '@nestjs/common';
import { Project, ProjectDocument } from './schemas/project.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose"
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>
  ) { }

  async create(dto: CreateProjectDto): Promise<ProjectDocument> {
    return this.projectModel.create(dto);
  }

  async getAll(): Promise<ProjectDocument[]> {
    return this.projectModel.find().exec();
  }

  async updateById(_id: string, dto: UpdateProjectDto): Promise<ProjectDocument> {
    const updatedProject = await this.projectModel.findByIdAndUpdate(
      _id,
      { $set: dto },
      { returnDocument: "after", runValidators: true }
    ).exec();

    if (!updatedProject) {
      throw new NotFoundException(`Project ID - ${_id} is not present in the database`);
    }

    return updatedProject;
  }

  async deleteById(_id: string): Promise<ProjectDocument> {
    const deleteProject = await this.projectModel.findByIdAndDelete(_id).exec()

    if (!deleteProject) {
      throw new NotFoundException(`Project with ID - ${_id} is not present`)
    }

    return deleteProject
  }
}
