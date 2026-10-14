import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Roadmap, RoadmapDocument } from "./schemas/roadmap.schema.js";
import {
  RoadmapNode,
  RoadmapNodeDocument,
} from "./schemas/roadmap-node.schema.js";
import {
  RoadmapEdge,
  RoadmapEdgeDocument,
} from "./schemas/roadmap-edge.schema.js";
import { CreateNodeDto } from "./dto/create-node.dto.js";
import { UpdateNodeDto } from "./dto/update-node.dto.js";

@Injectable()
export class RoadmapNodesService {
  constructor(
    @InjectModel(Roadmap.name)
    private readonly roadmapModel: Model<RoadmapDocument>,

    @InjectModel(RoadmapNode.name)
    private readonly nodeModel: Model<RoadmapNodeDocument>,

    @InjectModel(RoadmapEdge.name)
    private readonly edgeModel: Model<RoadmapEdgeDocument>,
  ) { }

  private async ensureRoadmapExists(roadmapId: Types.ObjectId) {
    const exists = await this.roadmapModel.exists({ _id: roadmapId });

    if (!exists) {
      throw new NotFoundException("Roadmap not found");
    }
  }

  async create(roadmapId: string, dto: CreateNodeDto) {
    const roadmapObjectId = new Types.ObjectId(roadmapId);
    await this.ensureRoadmapExists(roadmapObjectId);

    return this.nodeModel.create({
      roadmapId: roadmapObjectId,
      type: dto.type,
      title: dto.title,
      description: dto.description,
      position: { x: dto.position.x, y: dto.position.y },
      data: dto.data,
      isOptional: dto.isOptional,
    });
  }

  async findAll(roadmapId: string) {
    const roadmapObjectId = new Types.ObjectId(roadmapId);
    await this.ensureRoadmapExists(roadmapObjectId);

    return this.nodeModel
      .find({ roadmapId: roadmapObjectId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async update(roadmapId: string, nodeId: string, dto: UpdateNodeDto) {
    const set: Record<string, unknown> = {};

    if (dto.type !== undefined) set["type"] = dto.type;
    if (dto.title !== undefined) set["title"] = dto.title;
    if (dto.description !== undefined) set["description"] = dto.description;
    if (dto.isOptional !== undefined) set["isOptional"] = dto.isOptional;
    if (dto.data !== undefined) set["data"] = dto.data;

    if (dto.position?.x !== undefined) set["position.x"] = dto.position.x;
    if (dto.position?.y !== undefined) set["position.y"] = dto.position.y;

    const node = await this.nodeModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(nodeId),
          roadmapId: new Types.ObjectId(roadmapId),
        },
        { $set: set },
        { returnDocument: "after", runValidators: true },
      )
      .exec();

    if (!node) {
      throw new NotFoundException("Roadmap node not found");
    }

    return node;
  }

  async remove(roadmapId: string, nodeId: string) {
    const roadmapObjectId = new Types.ObjectId(roadmapId);
    const nodeObjectId = new Types.ObjectId(nodeId);

    const exists = await this.nodeModel.exists({
      _id: nodeObjectId,
      roadmapId: roadmapObjectId,
    });

    if (!exists) {
      throw new NotFoundException("Roadmap node not found");
    }

    await this.edgeModel
      .deleteMany({
        roadmapId: roadmapObjectId,
        $or: [{ sourceNodeId: nodeObjectId }, { targetNodeId: nodeObjectId }],
      })
      .exec();

    await this.nodeModel
      .deleteOne({ _id: nodeObjectId, roadmapId: roadmapObjectId })
      .exec();

    return { message: "Node deleted successfully" };
  }
}