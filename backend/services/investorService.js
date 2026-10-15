import { connectToDatabase } from '@/backend/config/db';
import InvestorTool from '@/backend/models/InvestorTool';
import Questionnaire from '@/backend/models/Questionnaire';
import Insurer from '@/backend/models/Insurer';
import { logAdminActivity } from '@/backend/lib/auth';
import { fallbackInvestorTools } from '@/lib/fallbackData';

export const investorService = {
  async getInvestorTools() {
    try {
      await connectToDatabase();
      const tools = await InvestorTool.find({ isVisible: true }).sort({ order: 1 }).lean();
      return (tools && tools.length) ? tools : fallbackInvestorTools;
    } catch {
      return fallbackInvestorTools;
    }
  },

  async getAllInvestorToolsAdmin() {
    await connectToDatabase();
    return InvestorTool.find({}).sort({ order: 1 }).lean();
  },

  async updateInvestorTools(tools, adminEmail, req) {
    await connectToDatabase();
    await InvestorTool.deleteMany({});
    const inserted = await InvestorTool.insertMany(tools);

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_INVESTOR_TOOLS',
      entity: 'InvestorTool',
      summary: `Updated ${inserted.length} investor corner tools.`,
      req,
    });
    return inserted;
  },

  async getQuestionnaire(code) {
    await connectToDatabase();
    const q = await Questionnaire.findOne({ code, isActive: true }).lean();
    if (!q) throw new Error('Questionnaire not found');
    return q;
  },

  async getInsurers(category = '') {
    try {
      await connectToDatabase();
      const filter = { isActive: true };
      if (category && category !== 'ALL') {
        filter.category = category;
      }
      return Insurer.find(filter).sort({ order: 1 }).lean();
    } catch {
      return [];
    }
  },

  async getAllInsurersAdmin() {
    await connectToDatabase();
    return Insurer.find({}).sort({ order: 1 }).lean();
  },

  async createInsurer(data, adminEmail, req) {
    await connectToDatabase();
    const insurer = await Insurer.create(data);
    await logAdminActivity({
      adminEmail,
      action: 'CREATE_INSURER',
      entity: 'Insurer',
      entityId: insurer._id,
      summary: `Created insurer: ${insurer.name}`,
      req,
    });
    return insurer;
  },

  async updateInsurer(id, data, adminEmail, req) {
    await connectToDatabase();
    const insurer = await Insurer.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!insurer) throw new Error('Insurer not found');
    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_INSURER',
      entity: 'Insurer',
      entityId: id,
      summary: `Updated insurer: ${insurer.name}`,
      req,
    });
    return insurer;
  },

  async deleteInsurer(id, adminEmail, req) {
    await connectToDatabase();
    const insurer = await Insurer.findByIdAndDelete(id);
    if (!insurer) throw new Error('Insurer not found');
    await logAdminActivity({
      adminEmail,
      action: 'DELETE_INSURER',
      entity: 'Insurer',
      entityId: id,
      summary: `Deleted insurer: ${insurer.name}`,
      req,
    });
    return true;
  },
};

export default investorService;
