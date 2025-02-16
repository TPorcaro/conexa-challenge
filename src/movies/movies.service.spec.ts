import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { StarWarsService } from 'src/starwars/starwars.service';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let starwarsService: StarWarsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(moviesService).toBeDefined();
  });

  describe('getAllMovies', () => {
    it('should return all movies', async () => {
      const movies = [
        {
          id: '1',
          title: 'Star Wars',
          description: 'A sci-fi classic',
          releaseYear: 1977,
          genre: 'Sci-Fi',
          createdAt: new Date(),
        },
      ];
      jest.spyOn(prisma.movie, 'findMany').mockResolvedValue(movies);

      expect(await moviesService.getAllMovies()).toEqual(movies);
    });

    it('should return an empty array if no movies exist', async () => {
      jest.spyOn(prisma.movie, 'findMany').mockResolvedValue([]);
      expect(await moviesService.getAllMovies()).toEqual([]);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      const movie = {
        id: '1',
        title: 'Star Wars',
        description: 'A sci-fi classic',
        releaseYear: 1977,
        genre: 'Sci-Fi',
        createdAt: new Date(),
      };
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValue(movie);

      expect(await moviesService.getMovieById('1')).toEqual(movie);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValue(null);

      await expect(moviesService.getMovieById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createMovie', () => {
    it('should create a movie', async () => {
      const movieDto = {
        title: 'Star Wars',
        description: 'A sci-fi classic',
        releaseYear: 1977,
        genre: 'Sci-Fi',
      };
      const createdMovie = { id: '1', ...movieDto, createdAt: new Date() };
      jest.spyOn(prisma.movie, 'create').mockResolvedValue(createdMovie);

      expect(await moviesService.createMovie(movieDto)).toEqual(createdMovie);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const updatedMovie = {
        id: '1',
        title: 'Updated Title',
        description: 'An updated description',
        releaseYear: 1980,
        genre: 'Sci-Fi',
        createdAt: new Date(),
      };
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValue(updatedMovie);
      jest.spyOn(prisma.movie, 'update').mockResolvedValue(updatedMovie);

      expect(await moviesService.updateMovie('1', { title: 'Updated Title' })).toEqual(updatedMovie);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValue(null);

      await expect(moviesService.updateMovie('999', { title: 'New Title' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      const deletedMovie = {
        id: '1',
        title: 'Deleted Movie',
        description: 'This movie was deleted',
        releaseYear: 2000,
        genre: 'Sci-Fi',
        createdAt: new Date(),
      };
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValue(deletedMovie);
      jest.spyOn(prisma.movie, 'delete').mockResolvedValue(deletedMovie);

      expect(await moviesService.deleteMovie('1')).toEqual(deletedMovie);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValue(null);

      await expect(moviesService.deleteMovie('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('syncMoviesFromSwapi', () => {
    it('should throw UnauthorizedException if a non-admin tries to sync movies', async () => {
      jest.spyOn(starwarsService, 'syncMoviesFromSwapi').mockImplementation(async () => {
        throw new UnauthorizedException('Admins only');
      });

      await expect(starwarsService.syncMoviesFromSwapi()).rejects.toThrow('Admins only');
    });

    it('should sync movies from SWAPI if called by an admin', async () => {
      jest.spyOn(starwarsService, 'syncMoviesFromSwapi').mockResolvedValue({
        message: 'Movies synced successfully!',
      });

      const result = await starwarsService.syncMoviesFromSwapi();
      expect(result).toEqual({
        message: 'Movies synced successfully!',
      });
    });
  });
});
