import { connectToDatabase } from '@/backend/config/db';
import PayPremium from '@/backend/models/PayPremium';
import { logAdminActivity } from '@/backend/lib/auth';

export const payPremiumService = {
  async getPublishedPayPremiums() {
    await connectToDatabase();
    const items = await PayPremium.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
    return items || [];
  },

  async getAllPayPremiumsAdmin() {
    await connectToDatabase();
    const items = await PayPremium.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return items || [];
  },

  async createPayPremium(data, adminEmail, req) {
    await connectToDatabase();
    const item = await PayPremium.create({
      title: data.title?.trim(),
      shortTitle: data.shortTitle?.trim() || '',
      description: data.description?.trim(),
      link: data.link?.trim(),
      order: Number(data.order) || 0,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });

    await logAdminActivity({
      adminEmail,
      action: 'CREATE_PAY_PREMIUM',
      entity: 'PayPremium',
      entityId: item._id,
      summary: `Created Pay Premium gateway: "${item.title}"`,
      req,
    });

    return item;
  },

  async updatePayPremium(id, data, adminEmail, req) {
    await connectToDatabase();
    const updatePayload = {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.shortTitle !== undefined && { shortTitle: data.shortTitle.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.link !== undefined && { link: data.link.trim() }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isPublished !== undefined && { isPublished: Boolean(data.isPublished) }),
    };

    const item = await PayPremium.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!item) {
      throw new Error('Pay Premium item not found');
    }

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_PAY_PREMIUM',
      entity: 'PayPremium',
      entityId: item._id,
      summary: `Updated Pay Premium gateway: "${item.title}"`,
      req,
    });

    return item;
  },

  async deletePayPremium(id, adminEmail, req) {
    await connectToDatabase();
    const item = await PayPremium.findByIdAndDelete(id);
    if (!item) {
      throw new Error('Pay Premium item not found');
    }

    await logAdminActivity({
      adminEmail,
      action: 'DELETE_PAY_PREMIUM',
      entity: 'PayPremium',
      entityId: id,
      summary: `Deleted Pay Premium gateway: "${item.title}"`,
      req,
    });

    return item;
  },
};

export default payPremiumService;
