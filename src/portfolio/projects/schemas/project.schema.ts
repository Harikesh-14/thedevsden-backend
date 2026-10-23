import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({
  timestamps: true,
})
export class Project {
  @Prop({
    trim: true,
    unique: true,
    required: true,
  })
  title: string;

  @Prop({
    trim: true,
    required: true,
  })
  description: string;

  @Prop({
    trim: true,
    required: true,
  })
  type: string;

  @Prop({
    type: [String],
    required: true,
  })
  skills: string[];

  @Prop({
    trim: true,
    unique: true,
    required: true,
  })
  href: string;

  @Prop({
    trim: true,
    required: true,
  })
  icon: string;

  @Prop({
    trim: true,
    unique: true,
    required: true,
    lowercase: true,
  })
  slug: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isFeatured: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
