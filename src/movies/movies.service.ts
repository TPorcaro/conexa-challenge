import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async getAllMovies() {
    return this.prisma.movie.findMany();
  }

  async getMovieById(id: string) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
    return movie;
  }

  async createMovie(data: { title: string; description?: string; releaseYear: number; genre: string }) {
    try {
      return this.prisma.movie.create({ data });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create movie');
    }
  }

  async updateMovie(id: string, data: Partial<{ title: string; description: string; releaseYear: number; genre: string }>) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);

    try {
      return this.prisma.movie.update({ where: { id }, data });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update movie');
    }
  }

  async deleteMovie(id: string) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);

    try {
      return this.prisma.movie.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete movie');
    }
  }
}
