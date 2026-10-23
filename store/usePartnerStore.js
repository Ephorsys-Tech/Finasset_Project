import { create } from 'zustand';
import apiClient from '@/lib/axios';


export const usePartnerStore = create((set, get) => ({
  partners: [],
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  success: null,

  /**
   * Fetch partners using Axios
   * @param {boolean} isAdmin - Whether to fetch from admin endpoint (all) or public (published only)
   */
  fetchPartners: async (isAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = isAdmin ? '/api/v1/admin/partners' : '/api/v1/public/partners';
      const response = await apiClient.get(endpoint);
      const data = response.data?.data || response.data || [];
      const items = Array.isArray(data) ? data : [];

      set({
        partners: items,
        isLoading: false,
      });
      return items;
    } catch (err) {
      console.warn('Failed to fetch partners via Axios:', err.message);
      set({
        partners: [],
        error: err.message,
        isLoading: false,
      });
      return [];
    }
  },

  /**
   * Create a new partner using Axios
   */
  createPartner: async (payload) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.post('/api/v1/admin/partners', payload);
      const created = response.data?.data;

      set((state) => {
        const updated = [...state.partners, created];
        return {
          partners: updated,
          isSaving: false,
          success: 'Partner added successfully!',
        };
      });
      return created;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Update an existing partner using Axios
   */
  updatePartner: async (id, payload) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.put(`/api/v1/admin/partners?id=${id}`, payload);
      const updatedItem = response.data?.data;

      set((state) => {
        const updated = state.partners.map((p) =>
          p._id === id || p.id === id ? { ...p, ...payload, ...updatedItem } : p
        );
        return {
          partners: updated,
          isSaving: false,
          success: 'Partner updated successfully!',
        };
      });
      return updatedItem;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Delete a partner using Axios
   */
  deletePartner: async (id) => {
    set({ isDeleting: true, error: null, success: null });
    try {
      await apiClient.delete(`/api/v1/admin/partners?id=${id}`);

      set((state) => {
        const updated = state.partners.filter((p) => p._id !== id && p.id !== id);
        return {
          partners: updated,
          isDeleting: false,
          success: 'Partner deleted successfully!',
        };
      });
      return true;
    } catch (err) {
      set({ isDeleting: false, error: err.message });
      throw err;
    }
  },

  /**
   * Clear toast messages
   */
  clearMessages: () => {
    set({ error: null, success: null });
  },
}));

export default usePartnerStore;
