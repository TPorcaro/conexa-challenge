import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    MoviesModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
