import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewerUserService } from './reviewer-user.service';
import { CreateReviewerUserDto } from './dto/create-reviewer-user.dto';
import { UpdateReviewerUserDto } from './dto/update-reviewer-user.dto';

@Controller('reviewer-user')
export class ReviewerUserController {
  constructor(private readonly reviewerUserService: ReviewerUserService) {}

  @Post()
  create(@Body() createReviewerUserDto: CreateReviewerUserDto) {
    return this.reviewerUserService.create(createReviewerUserDto);
  }

  @Get()
  findAll() {
    return this.reviewerUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewerUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewerUserDto: UpdateReviewerUserDto) {
    return this.reviewerUserService.update(+id, updateReviewerUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewerUserService.remove(+id);
  }
}
