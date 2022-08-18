import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../common/guards';
import { GetUser } from '../common/decorators';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }
}
