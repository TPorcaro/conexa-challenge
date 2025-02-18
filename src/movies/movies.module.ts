import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StarWarsModule } from '../starwars/starwars.module';

@Module({
  imports: [
    JwtModule.register({}), 
    StarWarsModule, 
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    PrismaService,
    Reflector,
    RolesGuard,
    ConfigService,
  ],
})
export class MoviesModule {}
