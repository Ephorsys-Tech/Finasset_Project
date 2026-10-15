import { z } from 'zod';

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
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
