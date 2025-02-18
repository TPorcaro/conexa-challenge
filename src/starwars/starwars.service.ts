import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StarWarsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Synchronizes movies from the Star Wars API.
   * Runs every 15 minutes.
   * @throws InternalServerErrorException if the synchronization fails.
   */
  @Cron('*/15 * * * *')
  async syncMoviesFromSwapi() {
    try {
      const response = await axios.get('https://swapi.dev/api/films/');
      if (response.status !== 200) {
        throw new InternalServerErrorException('Failed to fetch movies from Star Wars API');
      }

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
      console.error('Error syncing movies:', error);
      throw new InternalServerErrorException('Failed to sync movies');
    }
  }
}
