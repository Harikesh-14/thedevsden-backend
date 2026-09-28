import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewProjectsPlanDocument = HydratedDocument<NewProjectsPlan>;

@Schema({
  timestamps: true,
})
export class NewProjectsPlan {
  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
  })
  content: string;

  @Prop({
    type: {
      frontend: {
        type: [String],
        default: [],
      },
      backend: {
        type: [String],
        default: [],
      },
      database: {
        type: [String],
        default: [],
      },
      mobile: {
        type: [String],
        default: [],
      },
      desktop: {
        type: [String],
        default: [],
      },
      cli: {
        type: [String],
        default: [],
      },
      aiMl: {
        type: [String],
        default: [],
      },
      devOps: {
        type: [String],
        default: [],
      },
      testing: {
        type: [String],
        default: [],
      },
      other: {
        type: [String],
        default: [],
      },
    },
    default: {},
  })
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];

    mobile: string[];
    desktop: string[];
    cli: string[];

    aiMl: string[];

    devOps: string[];
    testing: string[];
    other: string[];
  };
}

export const NewProjectsPlanSchema =
  SchemaFactory.createForClass(NewProjectsPlan);
