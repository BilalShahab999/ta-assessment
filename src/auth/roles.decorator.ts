import { SetMetadata } from '@nestjs/common';
import { ReviewerRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ReviewerRole[]) =>
  SetMetadata(ROLES_KEY, roles);
