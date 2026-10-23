import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoadmapDocument = HydratedDocument<Roadmap>;

export enum RoadmapVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

@Schema({ timestamps: true })
export class Roadmap {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  slug: string;

  @Prop({
    default: '',
    maxlength: 1000,
  })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(RoadmapVisibility),
    default: RoadmapVisibility.PRIVATE,
  })
  visibility: RoadmapVisibility;
}

export const RoadmapSchema = SchemaFactory.createForClass(Roadmap);

RoadmapSchema.index({ slug: 1 }, { unique: true });
