import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email({ message: 'Email is not valid' }),
  password: z.string().min(6, { message: 'The password must be at least 6 characters' }),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER')
});

export type AuthDto = z.infer<typeof AuthSchema>;