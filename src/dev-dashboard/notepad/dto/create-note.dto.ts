
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateNoteDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsIn(["Personal", "Ideas", "Development", "Learning"])
  category?: string;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean;
}