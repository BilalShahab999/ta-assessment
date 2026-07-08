import { Module } from '@nestjs/common';
import { AssessmentBriefController } from './assessment-brief.controller';
import { AssessmentBriefService } from './assessment-brief.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssessmentBriefController],
  providers: [AssessmentBriefService],
})
export class AssessmentBriefModule {}
