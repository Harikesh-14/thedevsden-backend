import { IsArray, ArrayNotEmpty, IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  @IsNotEmpty()
  href: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}