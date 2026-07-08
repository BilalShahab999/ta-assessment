import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewerRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@Controller('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ReviewerRole.HR)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Patch(':submissionId')
  review(
    @Param('submissionId') submissionId: string,
    @Body() dto: CreateReviewDto,
    @Req() req: any,
  ) {
    return this.reviewService.reviewSubmission(+submissionId, dto, req.user);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }
}
