import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssessmentBriefService {
  constructor(private readonly prisma: PrismaService) {}

  async getAssessmentBrief(privateToken: string) {
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
      throw new NotFoundException('Assessment brief not found');
    }

    return assessment;
  }
}
