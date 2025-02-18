import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new user with a hashed password.
   * @param email - The email of the user.
   * @param password - The plain text password.
   * @param role - The role of the user, defaults to 'USER'.
   * @returns A success message and the created user (excluding password).
   * @throws BadRequestException if the email is already registered.
   * @throws InternalServerErrorException if the user creation fails.
   */
  async register(email: string, password: string, role: 'USER' | 'ADMIN' = 'USER') {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.createUser(email, hashedPassword, role);
      
      return {
        message: 'User registered successfully',
        user: { id: user.id, email: user.email, role: user.role },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Authenticates a user and returns a JWT token.
   * @param email - The email of the user.
   * @param password - The plain text password to validate.
   * @returns A JWT access token if authentication is successful.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET') || 'default_secret_key',
        expiresIn: '1h',
      }),
    };
  }
}
