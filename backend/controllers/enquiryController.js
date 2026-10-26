import { enquiryService } from '@/backend/services/enquiryService';
import { validateEnquiry } from '@/backend/validators/enquiryValidator';
import { sendSuccess, sendError, sendBadRequest } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';
import { NextResponse } from 'next/server';

export const enquiryController = {
  async createEnquiry(req) {
    try {
      const body = await req.json().catch(() => ({}));
      const validation = validateEnquiry(body);
      if (!validation.success) {
        return sendBadRequest(validation.error.errors[0]?.message || 'Invalid input');
      }

      const enquiry = await enquiryService.createEnquiry(body, req);
      return sendSuccess(
        { trackingNumber: enquiry.trackingNumber },
        'Thank you! Your enquiry has been received. Our team will contact you shortly.',
        201
      );
    } catch (err) {
      return sendError(err.message, 400, err);
    }
  },

  async getEnquiries(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const page = url.searchParams.get('page') || 1;
      const limit = url.searchParams.get('limit') || 20;
      const status = url.searchParams.get('status') || '';
      const type = url.searchParams.get('type') || '';
      const search = url.searchParams.get('search') || '';

      const data = await enquiryService.getEnquiries({ page, limit, status, type, search });
      return sendSuccess(data);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateEnquiry(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const body = await req.json().catch(() => ({}));
      const id = url.searchParams.get('id') || body.id || body._id;
      if (!id) return sendBadRequest('Enquiry ID required');

      const updated = await enquiryService.updateEnquiry(id, body, auth.admin.email, req);
      return sendSuccess(updated, 'Enquiry updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteEnquiry(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const body = await req.json().catch(() => ({}));
      const id = url.searchParams.get('id') || body.id || body._id;
      if (!id) return sendBadRequest('Enquiry ID required');

      await enquiryService.deleteEnquiry(id, auth.admin.email, req);
      return sendSuccess(null, 'Enquiry deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async exportCsv(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const csv = await enquiryService.exportEnquiriesCsv();
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="finasset-leads-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default enquiryController;
