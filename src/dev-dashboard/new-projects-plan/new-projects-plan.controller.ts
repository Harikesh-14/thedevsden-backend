import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NewProjectsPlanService } from './new-projects-plan.service.js';
import { CreateNewProjectsPlanDto } from './dto/create-new-projects-plan.dto.js';

@Controller('new-projects-plan')
export class NewProjectsPlanController {
  constructor(
    private readonly newProjectsPlanService: NewProjectsPlanService
  ) { }

  @Post()
  create(@Body() createNewProjectsPlanDto: CreateNewProjectsPlanDto) {
    return this.newProjectsPlanService.create(createNewProjectsPlanDto);
  }

  @Get('/get/all')
  getAllProjectsPlans() {
    return this.newProjectsPlanService.getAll();
  }

  @Get('/get/:id')
  getProjectById(@Param('id') id: string) {
    return this.newProjectsPlanService.getById(id)
  }
}
