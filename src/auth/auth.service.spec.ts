import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashed_password',
    role: 'USER' as Role,
    createdAt : new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mocked_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'test_secret'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should register a user', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(usersService, 'createUser').mockResolvedValue(mockUser);
  
    const result = await authService.register(mockUser.email, '123456', mockUser.role);
  
    expect(result).toEqual({
      message: 'User registered successfully',
      user: {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      },
    });
  });

  it('should throw an error if user already exists', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

    await expect(authService.register(mockUser.email, '123456')).rejects.toThrow('User already exists');
  });

  it('should validate user login and return a token', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never); // mocked function
  
    const result = await authService.login(mockUser.email, '123456');
  
    expect(result).toHaveProperty('access_token', 'mocked_token');
  });

  it('should throw an error for invalid login credentials', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never); // mocked function
  
    await expect(authService.login(mockUser.email, 'wrongpassword')).rejects.toThrow('Wrong credentials');
  });

  it('should throw an error when user does not exist', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    await expect(authService.login('invalid@example.com', '123456')).rejects.toThrow(UnauthorizedException);
  });
});
