import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { GetSubmissionsQueryDto } from './dto/get-submissions-query.dto';
import { AuditAction } from '@prisma/client';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubmissionDto, privateToken: string) {
    if (!privateToken) {
      throw new UnauthorizedException('Private token is required');
    }

    const candidate = await this.prisma.candidate.findUnique({
      where: {
        privateToken,
      },
    });

    if (!candidate) {
      throw new UnauthorizedException('Invalid private token');
    }

    const assessment = await this.prisma.assessmentBrief.findFirst();

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const alreadySubmitted = await this.prisma.submission.findUnique({
      where: {
        candidateId_assessmentBriefId: {
          candidateId: candidate.id,
          assessmentBriefId: assessment.id,
        },
      },
    });

    if (alreadySubmitted) {
      throw new ConflictException('Assessment already submitted.');
    }

    const submission = await this.prisma.submission.create({
      data: {
        candidateId: candidate.id,
        assessmentBriefId: assessment.id,
        workLink: dto.workLink,
        fileReference: dto.fileReference,
        timeTaken: dto.timeTaken,
        notes: dto.notes,
        challenges: dto.challenges,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        submissionId: submission.id,
        action: AuditAction.SUBMISSION_CREATED,
        actor: candidate.email,
        newValue: submission,
      },
    });

    return {
      message: 'Submission created successfully.',
      submission,
    };
  }

  async findAll(query: GetSubmissionsQueryDto) {
    const {
      role,
      status,
      city,
      scoreMin,
      scoreMax,
      submittedDate,
      page,
      limit,
    } = query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (submittedDate) {
      const start = new Date(submittedDate);
      const end = new Date(submittedDate);
      end.setDate(end.getDate() + 1);

      where.submittedAt = {
        gte: start,
        lt: end,
      };
    }

    if (city) {
      where.candidate = {
        city,
      };
    }

    if (role) {
      where.assessmentBrief = {
        role,
      };
    }

    if (scoreMin || scoreMax) {
      where.review = {
        score: {},
      };

      if (scoreMin !== undefined) {
        where.review.score.gte = scoreMin;
      }

      if (scoreMax !== undefined) {
        where.review.score.lte = scoreMax;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.submission.findMany({
        where,
        include: {
          candidate: true,
          assessmentBrief: true,
          review: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          submittedAt: 'desc',
        },
      }),
      this.prisma.submission.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOne(id: number) {
    const submission = await this.prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        candidate: true,

        assessmentBrief: true,

        review: {
          include: {
            reviewer: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },

        auditLogs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found.');
    }

    return submission;
  }
}
