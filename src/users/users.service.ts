import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

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
   * Retrieves all users.
   * @returns A list of users with their ID, email, and role.
   * @throws InternalServerErrorException If the query fails.
   */
  async getAllUsers() {
    try {
      return await this.prisma.user.findMany({
        select: { id: true, email: true, role: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  /**
   * Finds a user by email.
   * @param email The email of the user.
   * @returns The user object if found.
   * @throws NotFoundException If the user does not exist.
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
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
      throw new InternalServerErrorException('Failed to find user by ID');
    }
  }

  /**
   * Updates the password of a user.
   * Admins can update any user, while regular users can only update their own password.
   * @param userId The ID of the user whose password is being updated.
   * @param updatePasswordDto The DTO containing the new password.
   * @param currentUser The currently authenticated user.
   * @returns The updated user object.
   * @throws ForbiddenException If a regular user tries to update another user's password.
   * @throws NotFoundException If the user does not exist.
   * @throws InternalServerErrorException If the update fails.
   */
  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto, currentUser: User) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (currentUser.role !== 'ADMIN' && currentUser.id !== userId) {
      throw new ForbiddenException('You can only change your own password');
    }

    const hashedPassword = await bcrypt.hash(updatePasswordDto.password, 10);
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  /**
   * Deletes a user.
   * Only admins can perform this action.
   * @param userId The ID of the user to delete.
   * @returns The deleted user object.
   * @throws NotFoundException If the user does not exist.
   * @throws InternalServerErrorException If the deletion fails.
   */
  async deleteUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return await this.prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
