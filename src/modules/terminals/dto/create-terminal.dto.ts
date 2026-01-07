import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateTerminalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Serial number must be at least 8 character' })
  serialNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Model must be at least 2 character' })
  brand: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Model must be at least 2 character' })
  model: string;

  @IsString()
  @IsOptional()
  deviceType?: string;
}
