import { Controller, Post, Body, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSchema, AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: AuthDto) {
    const parsedData = AuthSchema.safeParse(body);

    if (!parsedData.success) {
      throw new BadRequestException(parsedData.error.errors);
    }

    return this.authService.register(parsedData.data.email, parsedData.data.password, parsedData.data.role);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get access token' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: AuthDto) {
    const parsedData = AuthSchema.safeParse(body);

    if (!parsedData.success) {
      throw new BadRequestException(parsedData.error.errors);
    }

    return this.authService.login(parsedData.data.email, parsedData.data.password);
  }
}
