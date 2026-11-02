import { Injectable, NotFoundException } from '@nestjs/common';
import { Project, ProjectDocument } from './schemas/project.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

type SupportedLocale = 'en' | 'hi' | 'tr' | 'fr' | 'ru' | 'ta';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  private normalizeLocale(locale?: string): SupportedLocale {
    if (locale === 'hi' || locale === 'tr' || locale === 'fr' || locale === 'ru' || locale === 'ta') {
      return locale;
    }

    return 'en';
  }

  private localizeProject(
    project: ProjectDocument,
    locale: SupportedLocale,
  ) {
    const {
      translations,
      ...projectData
    } = project.toObject();

    // English is stored in the original project fields.
    if (locale === 'en') {
      return projectData;
    }

    const translation = translations?.[locale];

    return {
      ...projectData,
      title: translation?.title || projectData.title,
      description: translation?.description || projectData.description,
      type: translation?.type || projectData.type,
    };
  }

  async create(dto: CreateProjectDto): Promise<ProjectDocument> {
    return this.projectModel.create(dto);
  }

  async getAll(locale?: string) {
    const projects = await this.projectModel.find().exec();

    const selectedLocale = this.normalizeLocale(locale);

    return projects.map((project) =>
      this.localizeProject(project, selectedLocale),
    );
  }

  async getFeatured(locale?: string) {
    const projects = await this.projectModel
      .find({
        isFeatured: true,
      })
      .exec();

    const selectedLocale = this.normalizeLocale(locale);

    return projects.map((project) =>
      this.localizeProject(project, selectedLocale),
    );
  }

  async updateById(
    _id: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(
        _id,
        { $set: dto },
        { returnDocument: 'after', runValidators: true },
      )
      .exec();

    if (!updatedProject) {
      throw new NotFoundException(
        `Project ID - ${_id} is not present in the database`,
      );
    }

    return updatedProject;
  }

  async deleteById(_id: string): Promise<ProjectDocument> {
    const deleteProject = await this.projectModel
      .findByIdAndDelete(_id)
      .exec();

    if (!deleteProject) {
      throw new NotFoundException(
        `Project with ID - ${_id} is not present`,
      );
    }

    return deleteProject;
  }
}