import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'), 
});

export type AuthDto = z.infer<typeof AuthSchema>;
