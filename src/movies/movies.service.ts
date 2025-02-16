import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async getAllMovies() {
    return this.prisma.movie.findMany();
  }

  async getMovieById(id: string) {
    return this.prisma.movie.findUnique({ where: { id } });
  }

  async createMovie(data: { title: string; description?: string; releaseYear: number; genre: string }) {
    return this.prisma.movie.create({ data });
  }

  async updateMovie(id: string, data: Partial<{ title: string; description: string; releaseYear: number; genre: string }>) {
    return this.prisma.movie.update({ where: { id }, data });
  }

  async deleteMovie(id: string) {
    return this.prisma.movie.delete({ where: { id } });
  }
  async syncMoviesFromSwapi() {
    try {
      const response = await axios.get('https://swapi.dev/api/films/');
      const swapiMovies = response.data.results;


      for (const movie of swapiMovies) {
        const existingMovie = await this.prisma.movie.findFirst({
          where: { title: movie.title },
        });

        if (!existingMovie) {
          await this.prisma.movie.create({
            data: {
              title: movie.title,
              description: movie.opening_crawl,
              releaseYear: new Date(movie.release_date).getFullYear(),
              genre: 'Sci-Fi',
            },
          });
        }
      }

      return { message: 'Movies synced successfully!' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to sync movies');
    }
  }
}
