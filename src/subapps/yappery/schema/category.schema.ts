
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, collection: 'categories_master' })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  badgeText: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true, trim: true })
  icon: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Blog',
    required: true,
  })
  blog: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
