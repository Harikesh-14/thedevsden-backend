import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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


// PERFORMANCE INDEXES

// 1. Text Search Index (for keyword search across title and content)
BlogSchema.index({ title: 'text', content: 'text' });

// 2. Optimized index for default listings & tag filtering (Newest first)
// Matches: { isPublished: true, tags: 'nestjs' } sorted by publishedAt: -1
BlogSchema.index({ isPublished: 1, tags: 1, publishedAt: -1 });

// 3. Optimized index for trending/popular posts (Most viewed)
// Matches: { isPublished: true } sorted by viewsCount: -1, publishedAt: -1
BlogSchema.index({ isPublished: 1, viewsCount: -1, publishedAt: -1 });

// 4. Optimized index for chronological general listings without tags
// Matches: { isPublished: true } sorted by publishedAt: -1
BlogSchema.index({ isPublished: 1, publishedAt: -1 });