import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Decision } from '@prisma/client';

export class CreateReviewDto {
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;

  @IsEnum(Decision)
  decision!: Decision;

  @IsOptional()
  @IsString()
  privateNote?: string;
}
