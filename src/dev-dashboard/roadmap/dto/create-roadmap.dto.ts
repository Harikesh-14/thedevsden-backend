import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from "class-validator";
import { RoadmapVisibility } from "../schemas/roadmap.schema.js";

export class CreateRoadmapDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "slug must contain lowercase letters, numbers, and single hyphens between segments",
  })
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(RoadmapVisibility)
  visibility?: boolean
}