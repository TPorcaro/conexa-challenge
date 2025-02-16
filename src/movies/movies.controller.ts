import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
@UseGuards(AuthGuard('jwt'))
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'List of movies' })
  getAllMovies() {
    return this.moviesService.getAllMovies();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('USER')
  @ApiOperation({ summary: 'Get a movie by ID (User only)' })
  @ApiResponse({ status: 200, description: 'Movie details' })
  getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new movie (Admin only)' })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  createMovie(@Body() data: { title: string; description?: string; releaseYear: number; genre: string }) {
    return this.moviesService.createMovie(data);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a movie (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  updateMovie(@Param('id') id: string, @Body() data: Partial<{ title: string; description: string; releaseYear: number; genre: string }>) {
    return this.moviesService.updateMovie(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a movie (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  deleteMovie(@Param('id') id: string) {
    return this.moviesService.deleteMovie(id);
  }

  @Get('sync')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Sync movies from Star Wars API (Admin only)' })
  @ApiResponse({ status: 200, description: 'Movies synchronized successfully' })
  async syncMovies() {
    return this.moviesService.syncMoviesFromSwapi();
  }
}
