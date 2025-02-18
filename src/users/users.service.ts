import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new user in the database.
   * @param email The email of the user.
   * @param password The hashed password.
   * @param role The role of the user (USER or ADMIN).
   * @returns The created user object.
   * @throws InternalServerErrorException If the user cannot be created.
   */
  async createUser(email: string, password: string, role: 'USER' | 'ADMIN') {
    try {
      return await this.prisma.user.create({
        data: { email, password, role },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Finds a user by email.
   * @param email The email to search for.
   * @returns The user object if found.
   * @throws NotFoundException If the user does not exist.
   * @throws InternalServerErrorException If the query fails.
   */
  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException(`User with email ${email} not found`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  /**
   * Finds a user by ID.
   * @param id The ID of the user.
   * @returns The user object if found.
   * @throws NotFoundException If the user does not exist.
   * @throws InternalServerErrorException If the query fails.
   */
  async findById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find user by ID');
    }
  }
}
