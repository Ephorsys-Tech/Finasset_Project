import { z } from 'zod';

export const enquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .refine((val) => !/\d/.test(val), {
      message: 'Name cannot contain numbers',
    }),
  phone: z
    .string()
    .min(10, 'Valid 10-digit phone number is required')
    .refine((val) => /^\d{10}$/.test(val.trim()), {
      message: 'Phone number must contain exactly 10 digits without any special characters',
    }),
  email: z
    .string()
    .email('Valid email address required')
    .optional()
    .or(z.literal('')),
  type: z.string().optional(),
  serviceOfInterest: z.string().optional(),
  message: z.string().optional(),
  sourcePage: z.string().optional(),
  preferredTime: z.string().optional(),
});

export function validateEnquiry(data) {
  return enquirySchema.safeParse(data);
}

export default {
  enquirySchema,
  validateEnquiry,
};
