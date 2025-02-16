import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let mockUser: { id: string; email: string; password: string; role: 'USER' | 'ADMIN'; createdAt: Date };

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
            sign: jest.fn().mockReturnValue('mocked_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    mockUser = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt.hash('123456', 10), 
      role: 'USER',
      createdAt: new Date(),
    };

    jest.spyOn(bcrypt, 'hash').mockImplementation(async (password: string) => `hashed_${password}`);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async (plainText, hash) => hash === `hashed_${plainText}`);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should register a user', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(usersService, 'createUser').mockImplementation(async () => mockUser);

    const result = await authService.register(mockUser.email, '123456', mockUser.role);
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if user already exists', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

    await expect(authService.register(mockUser.email, '123456')).rejects.toThrow('User already exists');
  });

  it('should validate user login and return a token', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

    const result = await authService.login(mockUser.email, '123456');
    expect(result).toHaveProperty('access_token', 'mocked_token');
  });

  it('should throw an error for invalid login credentials', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

    await expect(authService.login(mockUser.email, 'wrongpassword')).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error when user does not exist', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    await expect(authService.login('invalid@example.com', '123456')).rejects.toThrow('Invalid credentials');
  });
});
