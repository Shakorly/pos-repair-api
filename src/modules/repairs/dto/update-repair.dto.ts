import { IsEnum, IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import {RepairStatus } from '../../../common/enums';

export class UpdateRepairDto {
    @IsEnum( RepairStatus, {message: 'Invalid repair status'})
    @IsOptional()
    status?: RepairStatus;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    diagnosisNotes?: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    qaRemarks?: string;

    @IsBoolean()
    @IsOptional()
    isHardToFix?: boolean


}