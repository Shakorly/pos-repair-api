import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Inalid Email formart' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must greater than 8' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'The text should be above 2 charaters' })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'The text should be above 2 charaters' })
  lastName: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role?: UserRole;
}
