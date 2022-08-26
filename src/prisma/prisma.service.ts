import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  clearDb() {
    // The transaction in this case is used to secure that prisma will not optimize querys and run one over other
    this.$transaction([this.bookmark.deleteMany(), this.user.deleteMany()]);
  }
}
