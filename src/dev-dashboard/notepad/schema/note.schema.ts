import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type NoteDocument = HydratedDocument<Note>;

@Schema({
  timestamps: true,
})
export class Note {
  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
  })
  title: string;

  @Prop({
    default: "",
  })
  content: string;

  @Prop({
    required: true,
    default: "Personal",
    enum: ["Personal", "Ideas", "Development", "Learning"],
  })
  category: string;

  @Prop({
    default: false,
  })
  pinned: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);