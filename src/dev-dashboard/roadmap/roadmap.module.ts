import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Roadmap, RoadmapSchema } from './schemas/roadmap.schema.js';
import { RoadmapEdge, RoadmapEdgeSchema } from './schemas/roadmap-edge.schema.js';
import { RoadmapNode, RoadmapNodeSchema } from './schemas/roadmap-node.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Roadmap.name, schema: RoadmapSchema },
      { name: RoadmapEdge.name, schema: RoadmapEdgeSchema },
      { name: RoadmapNode.name, schema: RoadmapNodeSchema }
    ])
  ]
})
export class RoadmapModule {}
