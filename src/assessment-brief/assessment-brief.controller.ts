import { Controller, Get, Headers } from '@nestjs/common';
import { AssessmentBriefService } from './assessment-brief.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Assessment Brief')
@Controller('assessment-brief')
export class AssessmentBriefController {
  constructor(
    private readonly assessmentBriefService: AssessmentBriefService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch assessment brief using private token' })
  @ApiHeader({
    name: 'x-private-token',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Assessment fetched successfully' })
  @ApiResponse({ status: 401, description: 'Invalid private token' })
  async getAssessmentBrief(@Headers('x-private-token') privateToken: string) {
    return this.assessmentBriefService.getAssessmentBrief(privateToken);
  }
}
