import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CandidateModule } from './candidate/candidate.module';
import { AssessmentBriefModule } from './assessment-brief/assessment-brief.module';
import { SubmissionModule } from './submission/submission.module';
import { ReviewModule } from './review/review.module';
import { ReviewerUserModule } from './reviewer-user/reviewer-user.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CandidateModule,
    AssessmentBriefModule,
    SubmissionModule,
    ReviewModule,
    ReviewerUserModule,
    AuditLogModule,
    AuthModule,
  ],
})
export class AppModule {}
