import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ _id: false })
export class ProjectTranslation {
  @Prop({ trim: true })
  title?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  type?: string;
}

export const ProjectTranslationSchema =
  SchemaFactory.createForClass(ProjectTranslation);

@Schema({ _id: false })
export class ProjectTranslations {
  @Prop({ type: ProjectTranslationSchema })
  en?: ProjectTranslation;

  @Prop({ type: ProjectTranslationSchema })
  hi?: ProjectTranslation;

  @Prop({ type: ProjectTranslationSchema })
  tr?: ProjectTranslation;

  @Prop({ type: ProjectTranslationSchema })
  ru?: ProjectTranslation;

  @Prop({ type: ProjectTranslationSchema })
  ta?: ProjectTranslation;

  @Prop({ type: ProjectTranslationSchema })
  fr?: ProjectTranslation;
}

export const ProjectTranslationsSchema =
  SchemaFactory.createForClass(ProjectTranslations);

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

  @Prop({
    type: ProjectTranslationsSchema,
    default: {},
  })
  translations?: ProjectTranslations;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);