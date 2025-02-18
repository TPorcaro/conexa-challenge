import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all movies from the database.
   * @returns An array of movies.
   * @throws InternalServerErrorException if the query fails.
   */
  async getAllMovies() {
    try {
      return await this.prisma.movie.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve movies');
    }
  }

  /**
   * Retrieves a specific movie by its ID.
   * @param id - The ID of the movie to retrieve.
   * @returns The movie object if found.
   * @throws NotFoundException if the movie does not exist.
   * @throws InternalServerErrorException if the query fails.
   */
  async getMovieById(id: string) {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } });
      if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve movie');
    }
  }

  /**
   * Creates a new movie in the database.
   * @param data - The movie details.
   * @returns The created movie object.
   * @throws InternalServerErrorException if the movie creation fails.
   */
  async createMovie(data: { title: string; description?: string; releaseYear: number; genre: string }) {
    try {
      return await this.prisma.movie.create({ data });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create movie');
    }
  }

  /**
   * Updates an existing movie.
   * @param id - The ID of the movie to update.
   * @param data - The updated movie details.
   * @returns The updated movie object.
   * @throws NotFoundException if the movie does not exist.
   * @throws InternalServerErrorException if the update fails.
   */
  async updateMovie(id: string, data: Partial<{ title: string; description: string; releaseYear: number; genre: string }>) {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } });
      if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
      return await this.prisma.movie.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update movie');
    }
  }

  /**
   * Deletes a movie from the database.
   * @param id - The ID of the movie to delete.
   * @returns The deleted movie object.
   * @throws NotFoundException if the movie does not exist.
   * @throws InternalServerErrorException if the deletion fails.
   */
  async deleteMovie(id: string) {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } });
      if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
      return await this.prisma.movie.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete movie');
    }
  }
}
