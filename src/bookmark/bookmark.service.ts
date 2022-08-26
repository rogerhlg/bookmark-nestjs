import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { EmptyError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarkByUser(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.findBookmark(bookmarkId);

    if (!bookmark) throw new NotAcceptableException('No such bookmark exists ');

    if (bookmark.userId !== userId)
      throw new ForbiddenException('You does not have access to this action');

    return bookmark;
  }

  async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    const bookmark = await this.findBookmark(bookmarkId);

    if (!bookmark) throw new NotAcceptableException('No such bookmark exists ');

    if (bookmark.userId !== userId)
      throw new ForbiddenException('You does not have access to this action');

    const bookmarkUpdated = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });

    return bookmarkUpdated;
  }

  async deleteBookmark(bookmarkId: number, userId: number) {
    const bookmark = await this.findBookmark(bookmarkId);

    if (!bookmark) throw new NotAcceptableException('No such bookmark exists ');

    if (bookmark.userId !== userId)
      throw new ForbiddenException('You does not have access to this action');

    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  createBookmark(userId: number, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        ...dto,
        userId: userId,
      },
    });
  }

  async findBookmark(bookmarkId: number): Promise<Bookmark> {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    return bookmark;
  }
}
