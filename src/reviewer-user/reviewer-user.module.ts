import { Module } from '@nestjs/common';
import { ReviewerUserService } from './reviewer-user.service';
import { ReviewerUserController } from './reviewer-user.controller';

@Module({
  controllers: [ReviewerUserController],
  providers: [ReviewerUserService],
})
export class ReviewerUserModule {}
