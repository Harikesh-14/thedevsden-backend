import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class SkillsDto {
  @IsArray()
  @IsString({ each: true })
  frontend: string[]

  @IsArray()
  @IsString({ each: true })
  backend: string[]

  @IsArray()
  @IsString({ each: true })
  database: string[]

  @IsArray()
  @IsString({ each: true })
  mobile: string[]

  @IsArray()
  @IsString({ each: true })
  desktop: string[]

  @IsArray()
  @IsString({ each: true })
  cli: string[]

  @IsArray()
  @IsString({ each: true })
  aiMl: string[]

  @IsArray()
  @IsString({ each: true })
  devOps: string[]

  @IsArray()
  @IsString({ each: true })
  testing: string[]

  @IsArray()
  @IsString({ each: true })
  other: string[]
}

export class CreateNewProjectsPlanDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SkillsDto)
  skills: SkillsDto
}