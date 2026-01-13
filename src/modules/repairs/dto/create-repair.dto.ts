import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, MinLength, MaxLength,IsUUID} from 'class-validator';

export class CreateRepairDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Repair code must be at least 3 characters'})
    @MaxLength(10, {message: 'Reapir code must not exceed 10 characters'})
    repairCode: string;

    @IsUUID('4', { message: 'Terminal id must be a valid UUID'})
    @IsNotEmpty()
    terminalId: string;

    @IsUUID('4', {message: 'Assigned technician ID must e a valid UUID'})
    @IsNotEmpty()
    assignedToId: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    initialIssue?: string;
}