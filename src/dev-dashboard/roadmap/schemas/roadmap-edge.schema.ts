import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type RoadmapEdgeDocument = HydratedDocument<RoadmapEdge>;

export enum RoadmapEdgeType {
  PREREQUISITE = "prerequisite",
  RELATED = "related",
  OPTIONAL = "optional",
}

@Schema({ timestamps: true })
export class RoadmapEdge {
  @Prop({
    type: Types.ObjectId,
    ref: "Roadmap",
    required: true,
  })
  roadmapId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "RoadmapNode",
    required: true,
  })
  sourceNodeId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "RoadmapNode",
    required: true,
  })
  targetNodeId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(RoadmapEdgeType),
    default: RoadmapEdgeType.PREREQUISITE,
  })
  type: RoadmapEdgeType;

  @Prop({ type: String, default: null })
  label: string | null;
}

export const RoadmapEdgeSchema = SchemaFactory.createForClass(RoadmapEdge);

RoadmapEdgeSchema.index(
  { roadmapId: 1, sourceNodeId: 1, targetNodeId: 1 },
  { unique: true },
);

RoadmapEdgeSchema.index({ roadmapId: 1, targetNodeId: 1 });