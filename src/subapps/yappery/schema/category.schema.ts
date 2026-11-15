import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, collection: 'categories_master' })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ required: true, trim: true })
  badgeText: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true, trim: true })
  icon: string;

  @Prop({
    required: true,
    enum: ['primary', 'secondary', 'tertiary'],
    default: 'primary',
  })
  accent: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index(
  { blog: 1, slug: 1 },
  { unique: true },
);