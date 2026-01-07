import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateTerminalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  serialNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  brand: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  model: string;

  @IsString()
  @IsOptional()
  deviceType?: string;
}
