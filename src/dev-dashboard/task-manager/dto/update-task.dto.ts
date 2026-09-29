import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  task?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsOptional()
  @IsIn(['high', 'medium', 'low'])
  priority?: 'high' | 'medium' | 'low'
}