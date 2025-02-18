import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedpassword123',
    role: Role.USER,
    createdAt: new Date(),
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.findByEmail('notfound@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);
      const result = await service.createUser('newuser@example.com', 'password123', 'USER');
      expect(result).toEqual(mockUser);
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      jest.spyOn(prisma.user, 'create').mockRejectedValue(new Error());
      await expect(service.createUser('error@example.com', 'password123', 'USER')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updatePassword', () => {
    it('should throw ForbiddenException if non-admin tries to update another user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser); // Asegura que el usuario existe
  
      const updatePasswordDto = { password: 'newpassword123' };
      const nonAdminUser = { ...mockUser, role: 'USER' as Role }; // Simula un usuario normal
  
      await expect(service.updatePassword('2', updatePasswordDto, nonAdminUser))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return confirmation', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser);
  
      const result = await service.deleteUser(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  
    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
  
      await expect(service.deleteUser('99')).rejects.toThrow(NotFoundException);
    });
  });
});
