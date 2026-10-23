import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Roadmap, RoadmapSchema } from './schemas/roadmap.schema.js';
import {
  RoadmapEdge,
  RoadmapEdgeSchema,
} from './schemas/roadmap-edge.schema.js';
import {
  RoadmapNode,
  RoadmapNodeSchema,
} from './schemas/roadmap-node.schema.js';

import { RoadmapService } from './roadmap.service.js';
import { RoadmapController } from './roadmap.controller.js';
import { RoadmapNodesService } from './roadmap-nodes.service.js';
import { RoadmapNodesController } from './roadmap-nodes.controller.js';
import { RoadmapEdgesService } from './roadmap-edges.service.js';
import { RoadmapEdgesController } from './roadmap-edges.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Roadmap.name, schema: RoadmapSchema },
      { name: RoadmapEdge.name, schema: RoadmapEdgeSchema },
      { name: RoadmapNode.name, schema: RoadmapNodeSchema },
    ]),
  ],
  providers: [RoadmapService, RoadmapNodesService, RoadmapEdgesService],
  controllers: [
    RoadmapController,
    RoadmapNodesController,
    RoadmapEdgesController,
  ],
})
export class RoadmapModule {}
