import { create } from 'zustand';
import apiClient from '@/lib/axios';
import { fallbackServices } from '@/lib/fallbackData';

/**
 * Zustand Store for Services
 * Handles fetching published services from the database via Axios
 * so public forms (like CallbackForm) and the homepage stay dynamically in sync
 * with services managed by the Admin.
 */
export const useServiceStore = create((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  /**
   * Set services directly (e.g. from initial props or parent fetch)
   */
  setServices: (services) => {
    if (Array.isArray(services) && services.length > 0) {
      set({ services });
    }
  },

  /**
   * Fetch services using Axios
   * @param {boolean} isAdmin - Whether to fetch all services (admin) or only published (public)
   */
  fetchServices: async (isAdmin = false) => {
    // If services already loaded and public requested, return existing
    if (!isAdmin && get().services.length > 0) {
      return get().services;
    }

    set({ isLoading: true, error: null });
    try {
      const endpoint = isAdmin ? '/api/v1/admin/services' : '/api/v1/public/services';
      const response = await apiClient.get(endpoint);
      const data = response.data?.data || response.data || [];
      const items = Array.isArray(data) ? data : [];

      set({
        services: items,
        isLoading: false,
      });
      return items;
    } catch (err) {
      console.warn('Failed to fetch services via Axios:', err.message);
      set({
        isLoading: false,
        error: err.message,
      });
      return get().services;
    }
  },
}));

export default useServiceStore;
