import { Injectable } from '@nestjs/common';
import * as Argon from 'argon2';
import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async editUser(userId: number, dto: EditUserDto) {
    let hash: string;

    if (dto.password) {
      hash = await Argon.hash(dto.password);
      delete dto.password;
    }

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        hash,
      },
    });

    delete user.hash;
    return user;
  }
}
