import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['ADMIN']).optional().default('ADMIN'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export function validateRegister(data) {
  return registerSchema.safeParse(data);
}

export function validateLogin(data) {
  return loginSchema.safeParse(data);
}

export function validateForgotPassword(data) {
  return forgotPasswordSchema.safeParse(data);
}

export function validateResetPassword(data) {
  return resetPasswordSchema.safeParse(data);
}

export default {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
