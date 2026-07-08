import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SubmissionStatus } from '@prisma/client';

export class GetSubmissionsQueryDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  scoreMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  scoreMax?: number;

  @IsOptional()
  @IsString()
  submittedDate?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;
}
