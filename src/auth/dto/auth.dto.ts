import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
});

export type AuthDto = z.infer<typeof AuthSchema>;
export class AuthUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
  password: string;

  @ApiProperty({ example: 'USER', description: 'User role (USER or ADMIN)', enum: ['USER', 'ADMIN'], required: false })
  role?: 'USER' | 'ADMIN';
}

