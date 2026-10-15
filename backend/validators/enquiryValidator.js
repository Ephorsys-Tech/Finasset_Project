import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email('Valid email address required').optional().or(z.literal('')),
  type: z.enum(['CALLBACK', 'CONTACT', 'SERVICE_CONSULTATION', 'RISK_ASSESSMENT', 'CAREER', 'callback', 'contact']).optional(),
  serviceOfInterest: z.string().optional(),
  message: z.string().optional(),
  sourcePage: z.string().optional(),
});

export function validateEnquiry(data) {
  return enquirySchema.safeParse(data);
}

export default {
  enquirySchema,
  validateEnquiry,
};
