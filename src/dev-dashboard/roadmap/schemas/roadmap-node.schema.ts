import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoadmapNodeDocument = HydratedDocument<RoadmapNode>;

export enum RoadmapNodeType {
  TOPIC = 'topic',
  PROJECT = 'project',
  RESOURCE = 'resource',
  SECTION = 'section',
  DECISION = 'decision',
}

@Schema({ timestamps: true })
export class RoadmapNode {
  @Prop({
    type: Types.ObjectId,
    ref: 'Roadmap',
    required: true,
  })
  roadmapId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(RoadmapNodeType),
    required: true,
  })
  type: RoadmapNodeType;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    type: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    required: true,
    _id: false,
  })
  position: {
    x: number;
    y: number;
  };

  @Prop({ type: Object, default: {} })
  data: Record<string, unknown>;

  @Prop({ default: false })
  isOptional: boolean;
}

export const RoadmapNodeSchema = SchemaFactory.createForClass(RoadmapNode);

RoadmapNodeSchema.index({ roadmapId: 1, type: 1 });
