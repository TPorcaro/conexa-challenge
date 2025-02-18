import { Module } from '@nestjs/common';
import { StarWarsService } from './starwars.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [StarWarsService, PrismaService],
  exports: [StarWarsService],
})
export class StarWarsModule {}
