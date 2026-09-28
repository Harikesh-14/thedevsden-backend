import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password length must be at least 8 characters long.',
  })
  password: string;
}
