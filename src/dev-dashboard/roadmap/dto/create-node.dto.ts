import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoadmapNodeType } from '../schemas/roadmap-node.schema.js';

class NodePositionDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

export class CreateNodeDto {
  @IsEnum(RoadmapNodeType)
  type: RoadmapNodeType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => NodePositionDto)
  position: NodePositionDto;

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;
}
