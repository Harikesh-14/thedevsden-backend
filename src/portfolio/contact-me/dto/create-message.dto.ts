import { 
  IsEmail, 
  IsLowercase, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MaxLength, 
  MinLength 
} from "class-validator";

export class CreateMessageDto {
  @IsString({ message: "Name must be a valid string." })
  @IsNotEmpty({ message: "Name is required to send the message." })
  name: string;

  @IsString({ message: "Email must be a valid string." })
  @IsNotEmpty({ message: "Email is required to send the message." })
  @IsEmail({}, { message: "Please provide a valid email address." })
  @IsLowercase({ message: "Email must be in lowercase." })
  email: string;

  @IsOptional()
  @IsString({ message: "Subject must be a valid string." })
  subject?: string;

  @IsString({ message: "Message must be a valid string." })
  @IsNotEmpty({ message: "Message content cannot be empty." })
  @MinLength(5, { message: "Message must be at least 5 characters long." })
  @MaxLength(1000, { message: "Message must be at most 1000 characters long." })
  message: string;
}