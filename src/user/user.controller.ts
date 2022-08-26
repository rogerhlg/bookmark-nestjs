import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../common/guards';
import { GetUser } from '../common/decorators';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }

  @Patch('edit')
  async editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    const user = await this.userService.editUser(userId, dto);
    console.log(user);

    return user;
  }
}
