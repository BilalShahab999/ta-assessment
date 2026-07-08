import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.auditLog.findMany({
      include: {
        submission: {
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBySubmission(submissionId: number) {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        submissionId,
      },
      include: {
        submission: {
          include: {
            candidate: true,
            assessmentBrief: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!logs.length) {
      throw new NotFoundException('No audit logs found for this submission.');
    }

    return logs;
  }
}
