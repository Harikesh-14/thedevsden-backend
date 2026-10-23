import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RoadmapNodesService } from './roadmap-nodes.service.js';
import { CreateNodeDto } from './dto/create-node.dto.js';
import { UpdateNodeDto } from './dto/update-node.dto.js';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('roadmap/:roadmapId/nodes')
export class RoadmapNodesController {
  constructor(private readonly roadmapNodesService: RoadmapNodesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('roadmapId', ParseObjectIdPipe) roadmapId: string,
    @Body() dto: CreateNodeDto,
  ) {
    return this.roadmapNodesService.create(roadmapId, dto);
  }

  @Get()
  findAll(@Param('roadmapId', ParseObjectIdPipe) roadmapId: string) {
    return this.roadmapNodesService.findAll(roadmapId);
  }

  @Patch(':nodeId')
  update(
    @Param('roadmapId', ParseObjectIdPipe) roadmapId: string,
    @Param('nodeId', ParseObjectIdPipe) nodeId: string,
    @Body() dto: UpdateNodeDto,
  ) {
    return this.roadmapNodesService.update(roadmapId, nodeId, dto);
  }

  @Delete(':nodeId')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('roadmapId', ParseObjectIdPipe) roadmapId: string,
    @Param('nodeId', ParseObjectIdPipe) nodeId: string,
  ) {
    return this.roadmapNodesService.remove(roadmapId, nodeId);
  }
}
