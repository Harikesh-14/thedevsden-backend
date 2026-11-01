import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectsService } from './projects.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get('/featured')
  async getFeaturedProjects(@Query('locale') locale?: string) {
    return this.projectsService.getFeatured(locale);
  }

  @Get()
  async getAll(@Query('locale') locale?: string) {
    return this.projectsService.getAll(locale);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.updateById(id, dto);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.projectsService.deleteById(id);
  }
}