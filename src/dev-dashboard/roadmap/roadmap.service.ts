import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Roadmap, RoadmapDocument } from './schemas/roadmap.schema.js';
import {
  RoadmapNode,
  RoadmapNodeDocument,
} from './schemas/roadmap-node.schema.js';
import {
  RoadmapEdge,
  RoadmapEdgeDocument,
} from './schemas/roadmap-edge.schema.js';
import { CreateRoadmapDto } from './dto/create-roadmap.dto.js';
import { isDuplicateKeyError } from '../../utils/is-duplicate-key-error.js';

@Injectable()
export class RoadmapService {
  constructor(
    @InjectModel(Roadmap.name)
    private readonly roadmapModel: Model<RoadmapDocument>,

    @InjectModel(RoadmapNode.name)
    private readonly roadmapNodeModel: Model<RoadmapNodeDocument>,

    @InjectModel(RoadmapEdge.name)
    private readonly roadmapEdgeModel: Model<RoadmapEdgeDocument>,
  ) {}

  async create(dto: CreateRoadmapDto): Promise<RoadmapDocument> {
    try {
      return await this.roadmapModel.create({
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        visibility: dto.visibility,
      });
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('A roadmap with this slug already exists');
      }

      throw error;
    }
  }

  async findAll(): Promise<RoadmapDocument[]> {
    return this.roadmapModel.find().exec();
  }

  async findOne(id: string): Promise<RoadmapDocument> {
    const roadmap = await this.roadmapModel
      .findById(new Types.ObjectId(id))
      .exec();

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    return roadmap;
  }

  /**
   * Children are removed before the parent. If a step fails part-way, the
   * roadmap still exists, so the request can simply be retried and will finish
   * the cleanup. No orphaned edges/nodes can outlive their roadmap.
   */
  async remove(id: string): Promise<{ message: string }> {
    const roadmap = await this.findOne(id);

    await this.roadmapEdgeModel.deleteMany({ roadmapId: roadmap._id });
    await this.roadmapNodeModel.deleteMany({ roadmapId: roadmap._id });
    await roadmap.deleteOne();

    return { message: 'Roadmap deleted successfully' };
  }
}
