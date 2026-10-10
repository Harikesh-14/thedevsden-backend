import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from "mongoose"
import { Roadmap, RoadmapDocument } from './schemas/roadmap.schema.js';
import { RoadmapNode, RoadmapNodeDocument } from './schemas/roadmap-node.schema.js';
import { RoadmapEdge, RoadmapEdgeDocument } from './schemas/roadmap-edge.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoadmapDto } from './dto/create-roadmap.dto.js';

@Injectable()
export class RoadmapService {
  constructor(
    @InjectModel(Roadmap.name)
    private readonly roadmapModel: Model<RoadmapDocument>,

    @InjectModel(RoadmapNode.name)
    private readonly roadmapNodeModel: Model<RoadmapNodeDocument>,

    @InjectModel(RoadmapEdge.name)
    private readonly roadmapEdgeModel: Model<RoadmapEdgeDocument>
  ) { }

  async create(dto: CreateRoadmapDto): Promise<RoadmapDocument> {
    try {
      const roadmap = new this.roadmapModel(dto)

      return await roadmap.save()
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new ConflictException(
          "A roadmap with this slug already exists",
        );
      }

      throw error;
    }
  }

  async findAll(): Promise<RoadmapDocument[]> {
    try {
      return await this.roadmapModel.find().exec();
    } catch (error: unknown) {
      throw error
    }
  }

  async findOne(id: string): Promise<RoadmapDocument> {
    const roadmap = await this.roadmapModel
      .findOne({ _id: new Types.ObjectId(id) })
      .exec();

    if (!roadmap) {
      throw new NotFoundException("Roadmap not found");
    }

    return roadmap;
  }

  async remove(id: string): Promise<{ message: string }> {
    const roadmap = await this.findOne(id);

    await this.roadmapEdgeModel.deleteMany({
      roadmapId: roadmap._id,
    });

    await this.roadmapNodeModel.deleteMany({
      roadmapId: roadmap._id,
    });

    await roadmap.deleteOne();

    return { message: "Roadmap deleted successfully" };
  }
}