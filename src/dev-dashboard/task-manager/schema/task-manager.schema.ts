import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
})
export class Task {
  @Prop({
    required: true,
    trim: true,
  })
  task: string;

  @Prop({
    type: String,
    default: null,
  })
  description: string | null;

  @Prop({
    default: false,
    required: true,
  })
  isCompleted: boolean;

  @Prop({
    required: true,
    default: 'medium',
    enum: ['high', 'medium', 'low'],
  })
  priority: 'high' | 'medium' | 'low';

  @Prop({
    required: true,
    type: Date
  })
  dueDate: Date | null;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
