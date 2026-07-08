import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { ReviewerRole } from '@prisma/client';

import { AuditLogService } from './audit-log.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ReviewerRole.HR)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  findAll() {
    return this.auditLogService.findAll();
  }

  @Get(':submissionId')
  findBySubmission(@Param('submissionId') submissionId: string) {
    return this.auditLogService.findBySubmission(+submissionId);
  }
}
