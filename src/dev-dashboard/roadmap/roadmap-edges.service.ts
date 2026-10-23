import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
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
  RoadmapEdgeType,
} from './schemas/roadmap-edge.schema.js';
import { CreateEdgeDto } from './dto/create-edge.dto.js';
import { isDuplicateKeyError } from '../../utils/is-duplicate-key-error.js';

@Injectable()
export class RoadmapEdgesService {
  constructor(
    @InjectModel(Roadmap.name)
    private readonly roadmapModel: Model<RoadmapDocument>,

    @InjectModel(RoadmapNode.name)
    private readonly nodeModel: Model<RoadmapNodeDocument>,

    @InjectModel(RoadmapEdge.name)
    private readonly edgeModel: Model<RoadmapEdgeDocument>,
  ) {}

  private async ensureRoadmapExists(roadmapId: Types.ObjectId) {
    const exists = await this.roadmapModel.exists({ _id: roadmapId });

    if (!exists) {
      throw new NotFoundException('Roadmap not found');
    }
  }

  /**
   * Adding source -> target closes a loop exactly when target can already
   * reach source through existing prerequisite edges.
   */
  private async wouldCreateCycle(
    roadmapId: Types.ObjectId,
    sourceId: Types.ObjectId,
    targetId: Types.ObjectId,
  ): Promise<boolean> {
    const edges = await this.edgeModel
      .find({ roadmapId, type: RoadmapEdgeType.PREREQUISITE })
      .select('sourceNodeId targetNodeId')
      .lean()
      .exec();

    const outgoing = new Map<string, string[]>();
    for (const edge of edges) {
      const from = edge.sourceNodeId.toString();
      const to = edge.targetNodeId.toString();
      const list = outgoing.get(from);
      if (list) {
        list.push(to);
      } else {
        outgoing.set(from, [to]);
      }
    }

    const goal = sourceId.toString();
    const visited = new Set<string>();
    const stack: string[] = [targetId.toString()];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (current === goal) return true;
      if (visited.has(current)) continue;
      visited.add(current);

      for (const next of outgoing.get(current) ?? []) {
        stack.push(next);
      }
    }

    return false;
  }

  async create(roadmapId: string, dto: CreateEdgeDto) {
    const roadmapObjectId = new Types.ObjectId(roadmapId);
    const sourceId = new Types.ObjectId(dto.sourceNodeId);
    const targetId = new Types.ObjectId(dto.targetNodeId);

    if (sourceId.equals(targetId)) {
      throw new BadRequestException('A node cannot connect to itself');
    }

    await this.ensureRoadmapExists(roadmapObjectId);

    const nodeCount = await this.nodeModel.countDocuments({
      roadmapId: roadmapObjectId,
      _id: { $in: [sourceId, targetId] },
    });

    if (nodeCount !== 2) {
      throw new BadRequestException('Both nodes must belong to this roadmap');
    }

    const type = dto.type ?? RoadmapEdgeType.PREREQUISITE;

    // Only prerequisite edges imply an order, so only they must stay acyclic.
    // "related" and "optional" links may legitimately run both ways.
    if (
      type === RoadmapEdgeType.PREREQUISITE &&
      (await this.wouldCreateCycle(roadmapObjectId, sourceId, targetId))
    ) {
      throw new UnprocessableEntityException(
        'This connection would create a circular prerequisite',
      );
    }

    try {
      return await this.edgeModel.create({
        roadmapId: roadmapObjectId,
        sourceNodeId: sourceId,
        targetNodeId: targetId,
        type,
        label: dto.label ?? null,
      });
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('This connection already exists');
      }

      throw error;
    }
  }

  async findAll(roadmapId: string) {
    const roadmapObjectId = new Types.ObjectId(roadmapId);
    await this.ensureRoadmapExists(roadmapObjectId);

    return this.edgeModel.find({ roadmapId: roadmapObjectId }).exec();
  }

  async remove(roadmapId: string, edgeId: string) {
    const edge = await this.edgeModel
      .findOneAndDelete({
        _id: new Types.ObjectId(edgeId),
        roadmapId: new Types.ObjectId(roadmapId),
      })
      .exec();

    if (!edge) {
      throw new NotFoundException('Roadmap connection not found');
    }

    return { message: 'Connection deleted successfully' };
  }
}
