import { connectToDatabase } from '@/backend/config/db';
import TaxationItem from '@/backend/models/TaxationItem';
import { logAdminActivity } from '@/backend/lib/auth';

export const taxationService = {
  async getPublishedTaxationItems() {
    await connectToDatabase();
    const items = await TaxationItem.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
    return items || [];
  },

  async getAllTaxationItemsAdmin() {
    await connectToDatabase();
    const items = await TaxationItem.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return items || [];
  },

  async createTaxationItem(data, adminEmail, req) {
    await connectToDatabase();
    const item = await TaxationItem.create({
      title: data.title?.trim(),
      description: data.description?.trim(),
      order: Number(data.order) || 0,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });

    await logAdminActivity({
      adminEmail,
      action: 'CREATE_TAXATION_ITEM',
      entity: 'TaxationItem',
      entityId: item._id,
      summary: `Created Taxation topic: "${item.title}"`,
      req,
    });

    return item;
  },

  async updateTaxationItem(id, data, adminEmail, req) {
    await connectToDatabase();
    const updatePayload = {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isPublished !== undefined && { isPublished: Boolean(data.isPublished) }),
    };

    const item = await TaxationItem.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!item) {
      throw new Error('Taxation topic not found');
    }

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_TAXATION_ITEM',
      entity: 'TaxationItem',
      entityId: item._id,
      summary: `Updated Taxation topic: "${item.title}"`,
      req,
    });

    return item;
  },

  async deleteTaxationItem(id, adminEmail, req) {
    await connectToDatabase();
    const item = await TaxationItem.findByIdAndDelete(id);
    if (!item) {
      throw new Error('Taxation topic not found');
    }

    await logAdminActivity({
      adminEmail,
      action: 'DELETE_TAXATION_ITEM',
      entity: 'TaxationItem',
      entityId: id,
      summary: `Deleted Taxation topic: "${item.title}"`,
      req,
    });

    return item;
  },

  async clearAutoSeededItems() {
    await connectToDatabase();
    const seededTitles = [
      'Equity Linked Savings Scheme (ELSS)',
      'LTCG & STCG Rules on Equity Mutual Funds',
      'Bank or Post Office Fixed Deposits',
      'National Savings Certificate (NSC)',
      'Life Insurance Policy & Term Insurance',
      'Government Infrastructure Bonds',
      'Public Provident Fund (PPF)',
      'Pension Plans',
      'Unit Linked Insurance Plan (ULIP)',
      'Senior Citizens Saving Scheme (SCSS)',
      'Home Loan Principal Repayment',
      'Tuition Fees of Children',
      'Interest on Home Loan',
      'Medical Insurance Premium (Mediclaim)',
      'Education Loan Interest',
      'Donations to a Charity',
      'Other Deductions (Disability & Specified Diseases)',
      'Section 54 & 54EC Real Estate Capital Gain Bonds',
      'Section 80D & Comprehensive Health Protection Shield',
      'The Power of Annual LTCG Tax-Gain Harvesting',
      'Advance Tax Schedule & Section 234 Compliance',
      'New vs. Old Tax Regime Comparative Optimization'
    ];
    await TaxationItem.deleteMany({ title: { $in: seededTitles } });
  }
};

export default taxationService;
