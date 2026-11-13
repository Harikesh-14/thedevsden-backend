import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true, collection: 'blogs' })
export class Blog {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ trim: true, maxlength: 300 })
  excerpt: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], index: true })
  tags: string[];

  @Prop({ default: 0 })
  readingTime: number;

  @Prop({ default: false, index: true })
  isPublished: boolean;

  @Prop()
  publishedAt?: Date;

  @Prop({ default: 0 })
  viewsCount: number;

  @Prop({ trim: true })
  coverImage?: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.index({ title: 'text', content: 'text' });