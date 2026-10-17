import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectsService } from './projects.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return await this.projectsService.create(dto);
  }

  @Get('/featured')
  async getFeaturedProjects() {
    return this.projectsService.getFeatured()
  }

  @Get()
  async getAll() {
    return await this.projectsService.getAll();
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return await this.projectsService.updateById(id, dto);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.projectsService.deleteById(id);
  }
}