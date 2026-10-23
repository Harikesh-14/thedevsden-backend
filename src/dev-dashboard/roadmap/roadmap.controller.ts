import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoadmapService } from './roadmap.service.js';
import { CreateRoadmapDto } from './dto/create-roadmap.dto.js';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoadmapDto: CreateRoadmapDto) {
    return this.roadmapService.create(createRoadmapDto);
  }

  @Get()
  findAll() {
    return this.roadmapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.roadmapService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.roadmapService.remove(id);
  }
}
