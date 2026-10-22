import { z } from 'zod';

const phoneRegex = /^[+]?[\d\s\-()]{7,25}$/;

const phoneValidator = z
  .string({ required_error: 'Phone number is required' })
  .min(7, 'Phone number must be at least 7 digits')
  .max(25, 'Phone number cannot exceed 25 characters')
  .refine(
    (val) => {
      const trimmed = val.trim();
      const validChars = phoneRegex.test(trimmed);
      const digitsOnly = trimmed.replace(/\D/g, '');
      return validChars && digitsOnly.length >= 7 && digitsOnly.length <= 15;
    },
    {
      message: 'Please provide a valid phone number (7-15 digits, international code e.g. +971 accepted)',
    }
  );

export const enquirySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .refine((val) => !/\d/.test(val), {
      message: 'Name cannot contain numbers',
    }),
  phone: phoneValidator,
  email: z
    .string()
    .email('Valid email address required')
    .optional()
    .or(z.literal('')),
  country: z.string().optional(),
  type: z.string().optional(),
  serviceOfInterest: z.string().optional(),
  message: z.string().optional(),
  sourcePage: z.string().optional(),
  preferredTime: z.string().optional(),
});

export const nriEnquirySchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Name must be at least 2 characters')
    .refine((val) => !/\d/.test(val), {
      message: 'Name cannot contain numbers',
    }),
  email: z
    .string({ required_error: 'Email address is required' })
    .email('Valid email address is required'),
  phone: phoneValidator,
  country: z
    .string({ required_error: 'Country of residence is required' })
    .min(2, 'Please enter your current country of residence (e.g. UAE, USA, UK)'),
  message: z.string().optional(),
  type: z.string().optional(),
  serviceOfInterest: z.string().optional(),
  sourcePage: z.string().optional(),
  preferredTime: z.string().optional(),
});

export function validateEnquiry(data) {
  const isNri =
    (data?.type || '').toLowerCase() === 'nri' ||
    (data?.sourcePage || '').toLowerCase().includes('nri');

  if (isNri) {
    return nriEnquirySchema.safeParse(data);
  }
  return enquirySchema.safeParse(data);
}

export default {
  enquirySchema,
  nriEnquirySchema,
  validateEnquiry,
};
