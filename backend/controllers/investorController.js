import { investorService } from '@/backend/services/investorService';
import { sendSuccess, sendError, sendBadRequest, sendNotFound } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const investorController = {
  async getInvestorTools() {
    try {
      const tools = await investorService.getInvestorTools();
      return sendSuccess(tools);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getAllInvestorToolsAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const tools = await investorService.getAllInvestorToolsAdmin();
      return sendSuccess(tools);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateInvestorTools(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      const updated = await investorService.updateInvestorTools(body.tools || [], auth.admin.email, req);
      return sendSuccess(updated, 'Investor tools updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getQuestionnaire(code) {
    try {
      const q = await investorService.getQuestionnaire(code);
      return sendSuccess(q);
    } catch {
      return sendNotFound('Questionnaire not found');
    }
  },

  async getInsurers(req) {
    try {
      const url = new URL(req.url);
      const category = url.searchParams.get('category') || '';
      const insurers = await investorService.getInsurers(category);
      return sendSuccess(insurers);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getAllInsurersAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const insurers = await investorService.getAllInsurersAdmin();
      return sendSuccess(insurers);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createInsurer(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.name || !body.portalUrl) return sendBadRequest('Name and portal URL required');
      const insurer = await investorService.createInsurer(body, auth.admin.email, req);
      return sendSuccess(insurer, 'Insurer created successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateInsurer(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return sendBadRequest('Insurer ID required');

      const body = await req.json().catch(() => ({}));
      const insurer = await investorService.updateInsurer(id, body, auth.admin.email, req);
      return sendSuccess(insurer, 'Insurer updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteInsurer(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return sendBadRequest('Insurer ID required');

      await investorService.deleteInsurer(id, auth.admin.email, req);
      return sendSuccess(null, 'Insurer deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default investorController;
