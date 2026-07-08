import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateSubmissionDto {
  @IsUrl()
  workLink!: string;

  @IsOptional()
  @IsString()
  fileReference?: string;

  @IsInt()
  @Min(1)
  timeTaken!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  challenges?: string;
}
