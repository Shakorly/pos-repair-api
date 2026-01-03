import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(2, { message: 'must be at least 2 characters long' })
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(2, { message: ' must be at least 2 characters long' })
  @IsNotEmpty()
  lastName: string;
}
