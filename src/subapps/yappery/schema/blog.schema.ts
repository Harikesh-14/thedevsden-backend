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

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  category: Types.ObjectId;

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

// PERFORMANCE INDEXES
BlogSchema.index({ title: 'text', content: 'text' });

BlogSchema.index({ isPublished: 1, tags: 1, publishedAt: -1 });

BlogSchema.index({ isPublished: 1, viewsCount: -1, publishedAt: -1 });

BlogSchema.index({ isPublished: 1, publishedAt: -1 });