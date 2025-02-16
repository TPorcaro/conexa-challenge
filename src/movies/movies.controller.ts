import { 
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, NotFoundException, InternalServerErrorException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { StarWarsService } from '../starwars/starwars.service';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
@UseGuards(AuthGuard('jwt'))
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService, 
    private readonly starWarsService: StarWarsService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'List of movies' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllMovies() {
    try {
      return await this.moviesService.getAllMovies();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve movies');
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('USER')
  @ApiOperation({ summary: 'Get a movie by ID (User only)' })
  @ApiResponse({ status: 200, description: 'Movie details' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMovieById(@Param('id') id: string) {
    try {
      return await this.moviesService.getMovieById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve movie');
    }
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new movie (Admin only)' })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createMovie(@Body() data: { title: string; description?: string; releaseYear: number; genre: string }) {
    try {
      return await this.moviesService.createMovie(data);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create movie');
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a movie (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateMovie(@Param('id') id: string, @Body() data: Partial<{ title: string; description: string; releaseYear: number; genre: string }>) {
    try {
      return await this.moviesService.updateMovie(id, data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update movie');
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a movie (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteMovie(@Param('id') id: string) {
    try {
      return await this.moviesService.deleteMovie(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete movie');
    }
  }

  @Get('sync')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Sync movies from Star Wars API (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movies synchronized successfully' })
  @ApiResponse({ status: 500, description: 'Failed to sync movies' })
  async syncMovies() {
    try {
      return await this.starWarsService.syncMoviesFromSwapi();
    } catch (error) {
      throw new InternalServerErrorException('Failed to sync movies');
    }
  }
}
