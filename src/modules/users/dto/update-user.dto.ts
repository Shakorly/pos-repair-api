import { IsString, IsOptional, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Firstname must be greater than 2'})
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Lastname must be greater than 2 '})
  lastName?: string;
}
