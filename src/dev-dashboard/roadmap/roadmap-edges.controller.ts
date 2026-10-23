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

import { RoadmapEdgesService } from './roadmap-edges.service.js';
import { CreateEdgeDto } from './dto/create-edge.dto.js';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('roadmap/:roadmapId/edges')
export class RoadmapEdgesController {
  constructor(private readonly roadmapEdgesService: RoadmapEdgesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('roadmapId', ParseObjectIdPipe) roadmapId: string,
    @Body() dto: CreateEdgeDto,
  ) {
    return this.roadmapEdgesService.create(roadmapId, dto);
  }

  @Get()
  findAll(@Param('roadmapId', ParseObjectIdPipe) roadmapId: string) {
    return this.roadmapEdgesService.findAll(roadmapId);
  }

  @Delete(':edgeId')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('roadmapId', ParseObjectIdPipe) roadmapId: string,
    @Param('edgeId', ParseObjectIdPipe) edgeId: string,
  ) {
    return this.roadmapEdgesService.remove(roadmapId, edgeId);
  }
}
