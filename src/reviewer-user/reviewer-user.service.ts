import { Injectable } from '@nestjs/common';
import { CreateReviewerUserDto } from './dto/create-reviewer-user.dto';
import { UpdateReviewerUserDto } from './dto/update-reviewer-user.dto';

@Injectable()
export class ReviewerUserService {
  create(createReviewerUserDto: CreateReviewerUserDto) {
    return 'This action adds a new reviewerUser';
  }

  findAll() {
    return `This action returns all reviewerUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reviewerUser`;
  }

  update(id: number, updateReviewerUserDto: UpdateReviewerUserDto) {
    return `This action updates a #${id} reviewerUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} reviewerUser`;
  }
}
