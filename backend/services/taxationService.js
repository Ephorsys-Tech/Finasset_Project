import { connectToDatabase } from '@/backend/config/db';
import TaxationItem from '@/backend/models/TaxationItem';
import { logAdminActivity } from '@/backend/lib/auth';

export const initialTaxationItems = [
  {
    title: 'LTCG & STCG Rules on Equity Mutual Funds',
    category: 'Equity Mutual Funds',
    description:
      'Equity funds held >12 months are taxed at 12.5% on gains exceeding ₹1.25 Lakh per financial year. Short-term capital gains (<12 months) are taxed at 20%. Strategic asset allocations allow systematic long-term compounding with optimized tax impact.',
    order: 1,
    isPublished: true,
  },
  {
    title: 'Section 54 & 54EC Real Estate Capital Gain Bonds',
    category: 'Property & Capital Assets',
    description:
      'Save capital gains tax from residential or commercial property sales by investing up to ₹50 Lakhs in REC, PFC, IRFC, or NHAI sovereign capital gains bonds under Section 54EC within 6 months of transfer, or by purchasing a residential replacement property under Section 54/54F.',
    order: 2,
    isPublished: true,
  },
  {
    title: 'Section 80D & Comprehensive Health Protection Shield',
    category: 'Health & Insurance Shield',
    description:
      'Claim tax deductions of up to ₹25,000 for self, spouse, and dependent children, and an additional ₹50,000 for senior citizen parents on health insurance premiums and preventive health checkups under the Old Tax Regime framework.',
    order: 3,
    isPublished: true,
  },
  {
    title: 'The Power of Annual LTCG Tax-Gain Harvesting',
    category: 'Strategic Harvesting',
    description:
      'Every financial year, the government allows ₹1.25 Lakh of long-term capital gains on equity mutual funds to be completely tax-free. If you do not harvest these gains annually, the allowance lapses. By strategically booking and reinvesting before March 31st, you legally elevate your acquisition cost base and eliminate hefty retirement exit taxes.',
    order: 4,
    isPublished: true,
  },
  {
    title: 'Advance Tax Schedule & Section 234 Compliance',
    category: 'Regulatory Compliance',
    description:
      'Every individual, professional, or corporate entity with estimated net tax liability exceeding ₹10,000 per financial year must remit advance tax in quarterly installments (15% by June 15, 45% by Sept 15, 75% by Dec 15, and 100% by March 15) to avoid penal interest levied under Sections 234B and 234C.',
    order: 5,
    isPublished: true,
  },
  {
    title: 'New vs. Old Tax Regime Comparative Optimization',
    category: 'Regime Selection',
    description:
      'Finasset Wealth delivers end-to-end tax simulations comparing the simplified, lower slab structures of Section 115BAC (New Tax Regime) against the exemption-rich framework (HRA, Home Loan Interest, 80C, 80D, 80CCD NPS) of the Old Regime to pinpoint maximum net cashflow retention.',
    order: 6,
    isPublished: true,
  },
];

async function ensureSeedData() {
  const count = await TaxationItem.countDocuments();
  if (count === 0) {
    try {
      await TaxationItem.insertMany(initialTaxationItems);
    } catch (e) {
      console.warn('Failed to auto-seed initial Taxation items:', e.message);
    }
  }
}

export const taxationService = {
  async getPublishedTaxationItems() {
    await connectToDatabase();
    await ensureSeedData();
    const items = await TaxationItem.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
    return items || [];
  },

  async getAllTaxationItemsAdmin() {
    await connectToDatabase();
    await ensureSeedData();
    const items = await TaxationItem.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return items || [];
  },

  async createTaxationItem(data, adminEmail, req) {
    await connectToDatabase();
    const item = await TaxationItem.create({
      title: data.title?.trim(),
      description: data.description?.trim(),
      category: data.category?.trim() || 'Tax Advisory',
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
      ...(data.category !== undefined && { category: data.category.trim() }),
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
};

export default taxationService;
