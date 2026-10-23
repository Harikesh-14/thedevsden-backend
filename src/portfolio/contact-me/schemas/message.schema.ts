import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
  })
  subject: string;

  @Prop({
    required: true,
    trim: true,
  })
  message: string;

  @Prop({
    default: false,
  })
  isRead: boolean;

  @Prop({
    default: false,
  })
  replied: boolean;

  @Prop({
    default: false,
  })
  isArchived: boolean;

  @Prop({
    trim: true,
  })
  adminNotes?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
