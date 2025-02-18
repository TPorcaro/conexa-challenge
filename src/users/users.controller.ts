import { 
  Controller, Get, Put, Delete, Param, Body, UseGuards, Request 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Users')
@ApiBearerAuth()  
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users (only admin)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }


  @Get(':email')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get user by email (only admin)' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }


  @Put(':id/password')
  @ApiOperation({ summary: 'Update password (admin or self)' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updatePassword(
    @Param('id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req
  ) {
    return this.usersService.updatePassword(userId, updatePasswordDto, req.user);
  }


  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete user (only admin)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
