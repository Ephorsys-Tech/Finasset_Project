import { create } from 'zustand';
import apiClient from '@/lib/axios';

/**
 * Zustand Store for Services (Public & Admin)
 * Handles fetching published services, fetching individual service details by slug,
 * admin CRUD operations, and media uploads via Axios.
 */
export const useServiceStore = create((set, get) => ({
  // State
  services: [], // Public published services
  adminServices: [], // All services for admin panel (including unpublished)
  currentService: null, // Active service for detail page (/services/[slug])
  isLoading: false,
  isDetailLoading: false,
  isSaving: false,
  isDeleting: false,
  isUploading: false,
  error: null,
  success: null,

  /**
   * Set services directly (e.g. from initial props or parent fetch)
   */
  setServices: (services) => {
    if (Array.isArray(services) && services.length > 0) {
      set({ services });
    }
  },

  /**
   * Clear current selected service
   */
  clearCurrentService: () => set({ currentService: null }),

  /**
   * Clear notifications or errors
   */
  clearMessages: () => set({ error: null, success: null }),

  /**
   * Fetch services using Axios
   * @param {boolean} isAdmin - Whether to fetch all services (admin) or only published (public)
   */
  fetchServices: async (isAdmin = false) => {
    // If services already loaded and public requested without force reload, return existing
    if (!isAdmin && get().services.length > 0) {
      return get().services;
    }

    set({ isLoading: true, error: null });
    try {
      const endpoint = isAdmin ? '/api/v1/admin/services' : '/api/v1/public/services';
      const response = await apiClient.get(endpoint);
      const data = response.data?.data || response.data || [];
      const items = Array.isArray(data) ? data : [];

      if (isAdmin) {
        set({
          adminServices: items,
          isLoading: false,
        });
      } else {
        set({
          services: items,
          isLoading: false,
        });
      }
      return items;
    } catch (err) {
      console.warn('Failed to fetch services via Axios:', err.message);
      set({
        isLoading: false,
        error: err.message || 'Failed to fetch services',
      });
      return isAdmin ? get().adminServices : get().services;
    }
  },

  /**
   * Fetch a single service by its slug using Axios
   * @param {string} slug
   */
  fetchServiceBySlug: async (slug) => {
    if (!slug) return null;
    set({ isDetailLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/v1/public/services/${slug}`);
      const service = response.data?.data || null;

      set({
        currentService: service,
        isDetailLoading: false,
      });

      return service;
    } catch (err) {
      console.error(`Failed to fetch service (${slug}) via Axios:`, err);
      set({
        currentService: null,
        isDetailLoading: false,
        error: err.message || 'Service not found',
      });
      return null;
    }
  },

  /**
   * Upload media file (image/banner) to media library using Axios
   * @param {File} file
   * @returns {Promise<string>} Uploaded image URL
   */
  uploadMediaImage: async (file) => {
    if (!file) throw new Error('No file provided');
    set({ isUploading: true, error: null });
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file: ' + (e?.message || 'Unknown error')));
        reader.readAsDataURL(file);
      });

      const response = await apiClient.post('/api/v1/admin/media', {
        url: base64,
        filename: file.name,
        mimeType: file.type,
      });

      const uploadedUrl = response.data?.data?.url || base64;
      set({ isUploading: false });
      return uploadedUrl;
    } catch (err) {
      console.warn('Media upload API failed, falling back to data URL:', err.message);
      set({ isUploading: false });
      // Fallback: return base64 so service preview still works
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      return base64;
    }
  },

  /**
   * Create a new service using Axios
   * @param {Object} serviceData
   */
  createService: async (serviceData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.post('/api/v1/admin/services', serviceData);
      const created = response.data?.data;

      set((state) => ({
        adminServices: [...state.adminServices, created],
        services: created.isPublished !== false ? [...state.services, created] : state.services,
        isSaving: false,
        success: `Service "${created.name}" created successfully!`,
      }));

      return created;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create service';
      set({ isSaving: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Update an existing service using Axios
   * @param {string} id
   * @param {Object} serviceData
   */
  updateService: async (id, serviceData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.put(`/api/v1/admin/services?id=${id}`, {
        id,
        ...serviceData,
      });
      const updated = response.data?.data;

      set((state) => ({
        adminServices: state.adminServices.map((s) =>
          s._id === id || s.id === id ? { ...s, ...serviceData, ...updated } : s
        ),
        services: state.services.map((s) =>
          s._id === id || s.id === id ? { ...s, ...serviceData, ...updated } : s
        ),
        currentService:
          state.currentService?._id === id || state.currentService?.slug === updated?.slug
            ? updated
            : state.currentService,
        isSaving: false,
        success: `Service "${updated?.name || 'Item'}" updated successfully!`,
      }));

      return updated;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update service';
      set({ isSaving: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Delete a service using Axios
   * @param {string} id
   */
  deleteService: async (id) => {
    set({ isDeleting: true, error: null, success: null });
    try {
      await apiClient.delete(`/api/v1/admin/services?id=${id}`);

      set((state) => ({
        adminServices: state.adminServices.filter((s) => s._id !== id && s.id !== id),
        services: state.services.filter((s) => s._id !== id && s.id !== id),
        isDeleting: false,
        success: 'Service deleted successfully!',
      }));

      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete service';
      set({ isDeleting: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },
}));

export default useServiceStore;
