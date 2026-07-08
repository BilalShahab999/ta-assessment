import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const reviewer = await this.prisma.reviewerUser.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!reviewer) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatched = await bcrypt.compare(
      dto.password,
      reviewer.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: reviewer.id,
      email: reviewer.email,
      role: reviewer.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      reviewer: {
        id: reviewer.id,
        email: reviewer.email,
        role: reviewer.role,
      },
    };
  }
}
