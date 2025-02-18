import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
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
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'List of movies' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllMovies() {
    return await this.moviesService.getAllMovies();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('USER')
  @ApiOperation({ summary: 'Get a movie by ID (User only)' })
  @ApiResponse({ status: 200, description: 'Movie details' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMovieById(@Param('id') id: string) {
    return await this.moviesService.getMovieById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new movie (Admin only)' })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createMovie(@Body() data: { title: string; description?: string; releaseYear: number; genre: string }) {
    return await this.moviesService.createMovie(data);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a movie (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateMovie(@Param('id') id: string, @Body() data: Partial<{ title: string; description: string; releaseYear: number; genre: string }>) {
    return await this.moviesService.updateMovie(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a movie (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteMovie(@Param('id') id: string) {
    return await this.moviesService.deleteMovie(id);
  }

  @Get('sync')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Sync movies from Star Wars API (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movies synchronized successfully' })
  @ApiResponse({ status: 500, description: 'Failed to sync movies' })
  async syncMovies() {
    return await this.starWarsService.syncMoviesFromSwapi();
  }
}