import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  MaxLength,
  IsUrl,
  IsMongoId,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150, { message: 'Title is too long (max 150 characters)' })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(300, { message: 'Excerpt cannot exceed 300 characters' })
  excerpt?: string;

  @IsString()
  @IsNotEmpty({ message: 'Blog content cannot be empty' })
  content: string;

  @IsMongoId({ message: 'Please provide a valid category ID' })
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Cover image must be a valid URL' })
  coverImage?: string;
}