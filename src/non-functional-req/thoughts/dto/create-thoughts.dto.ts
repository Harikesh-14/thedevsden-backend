import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateThoughtsDto {
  @IsString()
  @IsNotEmpty()
  thought: string;

  @IsDateString()
  @IsNotEmpty()
  displayDate: Date;
}
