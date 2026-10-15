import { connectToDatabase } from '@/backend/config/db';
import Enquiry from '@/backend/models/Enquiry';
import { logAdminActivity } from '@/backend/lib/auth';

// In-memory rate limiting tracker (per IP)
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRecord = ipRateMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > userRecord.resetAt) {
    userRecord.count = 1;
    userRecord.resetAt = now + RATE_LIMIT_WINDOW_MS;
  } else {
    userRecord.count += 1;
  }

  ipRateMap.set(ip, userRecord);
  return userRecord.count <= MAX_REQUESTS_PER_WINDOW;
}

export const enquiryService = {
  async createEnquiry(data, req) {
    await connectToDatabase();

    const ipAddress =
      req?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req?.headers?.get('x-real-ip') ||
      '127.0.0.1';

    if (!checkRateLimit(ipAddress)) {
      throw new Error('Too many requests submitted from your network. Please wait a few minutes before trying again.');
    }

    const trackingNumber = `FIN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const enquiry = await Enquiry.create({
      trackingNumber,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      type: (data.type || 'CALLBACK').toUpperCase(),
      serviceOfInterest: data.serviceOfInterest || 'General Wealth Advisory',
      preferredTime: data.preferredTime || 'Anytime',
      message: data.message || '',
      sourcePage: data.sourcePage || 'Website Contact Form',
      status: 'NEW',
      ipAddress,
    });

    return enquiry;
  },

  async getEnquiries({ page = 1, limit = 20, status = '', type = '', search = '' } = {}) {
    await connectToDatabase();

    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (type && type !== 'ALL') {
      query.type = type.toUpperCase();
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Enquiry.countDocuments(query),
    ]);

    return {
      enquiries,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  },

  async updateEnquiry(id, updateData, adminEmail, req) {
    await connectToDatabase();
    const enquiry = await Enquiry.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_ENQUIRY',
      entity: 'Enquiry',
      entityId: id,
      summary: `Updated enquiry status to ${enquiry.status} for ${enquiry.name} (${enquiry.trackingNumber}).`,
      req,
    });

    return enquiry;
  },

  async exportEnquiriesCsv() {
    await connectToDatabase();
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();

    const headers = [
      'Tracking Number',
      'Date',
      'Name',
      'Phone',
      'Email',
      'Type',
      'Service Of Interest',
      'Preferred Time',
      'Status',
      'Source Page',
      'Message',
    ];

    const rows = enquiries.map((item) => [
      item.trackingNumber,
      item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${item.phone || ''}"`,
      `"${item.email || ''}"`,
      item.type,
      `"${(item.serviceOfInterest || '').replace(/"/g, '""')}"`,
      `"${(item.preferredTime || '').replace(/"/g, '""')}"`,
      item.status,
      `"${(item.sourcePage || '').replace(/"/g, '""')}"`,
      `"${(item.message || '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};

export default enquiryService;
