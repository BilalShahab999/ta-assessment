import { Body, Controller, Headers, Post, Get } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ReviewerRole } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { GetSubmissionsQueryDto } from './dto/get-submissions-query.dto';
import { Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Param } from '@nestjs/common';

@ApiTags('Submission')
@ApiBearerAuth()
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @ApiOperation({ summary: 'Submit assessment' })
  @ApiHeader({
    name: 'x-private-token',
    required: true,
  })
  create(
    @Body() dto: CreateSubmissionDto,
    @Headers('x-private-token') token: string,
  ) {
    return this.submissionService.create(dto, token);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ReviewerRole.HR)
  findAll(@Query() query: GetSubmissionsQueryDto) {
    return this.submissionService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ReviewerRole.HR)
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(+id);
  }
}
