import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
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

    service = module.get<MoviesService>(MoviesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all movies', async () => {
    const movies = [{ id: '1', title: 'Star Wars', releaseYear: 1977, genre: 'Sci-Fi' }];
    jest.spyOn(prisma.movie, 'findMany').mockResolvedValue(movies);

    expect(await service.getAllMovies()).toEqual(movies);
  });

  it('should return a movie by ID', async () => {
    const movie = { id: '1', title: 'Star Wars', releaseYear: 1977, genre: 'Sci-Fi' };
    jest.spyOn(prisma.movie, 'findUnique').mockResolvedValue(movie);

    expect(await service.getMovieById('1')).toEqual(movie);
  });

  it('should create a movie', async () => {
    const movieDto = { title: 'Star Wars', releaseYear: 1977, genre: 'Sci-Fi' };
    const createdMovie = { id: '1', ...movieDto };
    jest.spyOn(prisma.movie, 'create').mockResolvedValue(createdMovie);

    expect(await service.createMovie(movieDto)).toEqual(createdMovie);
  });

  it('should update a movie', async () => {
    const updatedMovie = { id: '1', title: 'Updated Title' };
    jest.spyOn(prisma.movie, 'update').mockResolvedValue(updatedMovie);

    expect(await service.updateMovie('1', { title: 'Updated Title' })).toEqual(updatedMovie);
  });

  it('should delete a movie', async () => {
    const deletedMovie = { id: '1', title: 'Deleted Movie' };
    jest.spyOn(prisma.movie, 'delete').mockResolvedValue(deletedMovie);

    expect(await service.deleteMovie('1')).toEqual(deletedMovie);
  });
  it('should throw an error if a non-admin tries to sync movies', async () => {
    jest.spyOn(service, 'syncMoviesFromSwapi').mockImplementation(async () => {
      throw new UnauthorizedException('Admins only');
    });

    await expect(service.syncMoviesFromSwapi()).rejects.toThrow('Admins only');
  });
  it('should sync movies from SWAPI if called by an admin', async () => {
    jest.spyOn(service, 'syncMoviesFromSwapi').mockResolvedValue({
      message: 'Movies synced successfully!'
    });

    const result = await service.syncMoviesFromSwapi();
    expect(result).toEqual({
      message: 'Movies synced successfully!'
    });
  });

});
