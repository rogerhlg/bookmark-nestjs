import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Permite que seja importado em qualquer lugar
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
