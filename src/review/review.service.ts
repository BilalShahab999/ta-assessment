import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction, Decision, SubmissionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async reviewSubmission(
    submissionId: number,
    dto: CreateReviewDto,
    reviewer: any,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        review: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found.');
    }

    if (submission.review) {
      throw new BadRequestException(
        'This submission has already been reviewed.',
      );
    }

    let status: SubmissionStatus = SubmissionStatus.REVIEWED;

    switch (dto.decision) {
      case Decision.PASS:
        status = SubmissionStatus.ACCEPTED;
        break;

      case Decision.FAIL:
        status = SubmissionStatus.REJECTED;
        break;

      case Decision.HOLD:
        status = SubmissionStatus.UNDER_REVIEW;
        break;
    }

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          submissionId,
          reviewerId: reviewer.id,
          score: dto.score,
          decision: dto.decision,
          privateNote: dto.privateNote,
        },
      });

      const updatedSubmission = await tx.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status,
        },
      });

      await tx.auditLog.create({
        data: {
          submissionId,
          action: AuditAction.REVIEW_ADDED,
          actor: reviewer.email,
          newValue: review,
        },
      });

      return {
        message: 'Review submitted successfully.',
        review,
        submission: updatedSubmission,
      };
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        reviewer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        submission: {
          include: {
            candidate: true,
            assessmentBrief: true,
          },
        },
      },
      orderBy: {
        reviewedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        submission: {
          include: {
            candidate: true,
            assessmentBrief: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    return review;
  }
}
