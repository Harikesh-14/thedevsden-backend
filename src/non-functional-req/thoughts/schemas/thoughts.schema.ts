import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ThoughtsDocument = HydratedDocument<Thoughts>

@Schema({
  timestamps: true
})
export class Thoughts {
  @Prop({
    required: true,
    trim: true
  })
  thought: string;

  @Prop({
    required: true,
    unique: true,
    index: true
  })
  displayDate: Date;
}

export const ThoughtsSchema = SchemaFactory.createForClass(Thoughts);