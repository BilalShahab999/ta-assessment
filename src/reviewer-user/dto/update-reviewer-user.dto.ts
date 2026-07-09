import { PartialType } from '@nestjs/swagger';
import { CreateReviewerUserDto } from './create-reviewer-user.dto';

export class UpdateReviewerUserDto extends PartialType(CreateReviewerUserDto) {}
