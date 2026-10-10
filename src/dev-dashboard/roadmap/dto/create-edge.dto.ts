import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { RoadmapEdgeType } from "../schemas/roadmap-edge.schema.js";

export class CreateEdgeDto {
  @IsMongoId()
  sourceNodeId: string;

  @IsMongoId()
  targetNodeId: string;

  @IsOptional()
  @IsEnum(RoadmapEdgeType)
  type?: RoadmapEdgeType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;
}