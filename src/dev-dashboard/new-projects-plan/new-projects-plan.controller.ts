import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NewProjectsPlanService } from './new-projects-plan.service.js';
import { CreateNewProjectsPlanDto } from './dto/create-new-projects-plan.dto.js';
import { UpdateNewProjectsPlanDto } from './dto/update-new-projects-plan.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('new-projects-plan')
export class NewProjectsPlanController {
  constructor(
    private readonly newProjectsPlanService: NewProjectsPlanService,
  ) {}

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
    return this.newProjectsPlanService.getById(id);
  }

  @Put('/update/:id')
  updateProjectById(
    @Param('id') id: string,
    @Body() dto: UpdateNewProjectsPlanDto,
  ) {
    return this.newProjectsPlanService.update(id, dto);
  }

  @Delete('/delete/:id')
  deleteProjectById(@Param('id') id: string) {
    return this.newProjectsPlanService.deleteById(id);
  }
}
