import { create } from 'zustand';
import apiClient from '@/lib/axios';
import { fallbackTestimonials } from '@/lib/fallbackData';

/**
 * Zustand Store for Client Testimonials
 * Manages testimonial slides, auto-play carousel intervals, and CRUD operations via Axios.
 */
export const useTestimonialStore = create((set, get) => ({
  testimonials: [],
  currentIndex: 0,
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  success: null,
  isAutoPlaying: true,

  /**
   * Set active slide index safely
   */
  setCurrentIndex: (index) => {
    const { testimonials } = get();
    if (!testimonials || testimonials.length === 0) {
      set({ currentIndex: 0 });
      return;
    }
    const safeIndex = (index + testimonials.length) % testimonials.length;
    set({ currentIndex: safeIndex });
  },

  /**
   * Next slide
   */
  nextSlide: () => {
    const { testimonials, currentIndex } = get();
    if (!testimonials || testimonials.length <= 1) return;
    set({ currentIndex: (currentIndex + 1) % testimonials.length });
  },

  /**
   * Previous slide
   */
  prevSlide: () => {
    const { testimonials, currentIndex } = get();
    if (!testimonials || testimonials.length <= 1) return;
    set({ currentIndex: (currentIndex - 1 + testimonials.length) % testimonials.length });
  },

  /**
   * Pause auto-play (e.g. on user hover)
   */
  pauseAutoPlay: () => {
    set({ isAutoPlaying: false });
  },

  /**
   * Resume auto-play (e.g. on mouse leave)
   */
  resumeAutoPlay: () => {
    set({ isAutoPlaying: true });
  },

  /**
   * Fetch testimonials using Axios
   * @param {boolean} isAdmin - Whether to fetch from admin endpoint (all) or public (published only)
   */
  fetchTestimonials: async (isAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = isAdmin ? '/api/v1/admin/testimonials' : '/api/v1/public/testimonials';
      const response = await apiClient.get(endpoint);
      const data = response.data?.data || response.data || [];
      const items = Array.isArray(data) && data.length > 0 ? data : (isAdmin ? [] : fallbackTestimonials);

      const curIdx = get().currentIndex;
      const safeIndex = curIdx < items.length ? curIdx : 0;

      set({
        testimonials: items,
        currentIndex: safeIndex,
        isLoading: false,
      });
      return items;
    } catch (err) {
      console.warn('Failed to fetch testimonials via Axios:', err.message);
      const fallback = isAdmin ? [] : fallbackTestimonials;
      set({
        testimonials: fallback,
        currentIndex: 0,
        error: err.message,
        isLoading: false,
      });
      return fallback;
    }
  },

  /**
   * Create a new testimonial using Axios
   */
  createTestimonial: async (payload) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.post('/api/v1/admin/testimonials', payload);
      const created = response.data?.data;

      set((state) => {
        const updated = [...state.testimonials, created];
        return {
          testimonials: updated,
          isSaving: false,
          success: 'Testimonial added successfully!',
        };
      });
      return created;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Update an existing testimonial using Axios
   */
  updateTestimonial: async (id, payload) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.put(`/api/v1/admin/testimonials?id=${id}`, payload);
      const updatedItem = response.data?.data;

      set((state) => {
        const updated = state.testimonials.map((t) =>
          t._id === id || t.id === id ? { ...t, ...payload, ...updatedItem } : t
        );
        return {
          testimonials: updated,
          isSaving: false,
          success: 'Testimonial updated successfully!',
        };
      });
      return updatedItem;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Delete a testimonial using Axios
   */
  deleteTestimonial: async (id) => {
    set({ isDeleting: true, error: null, success: null });
    try {
      await apiClient.delete(`/api/v1/admin/testimonials?id=${id}`);

      set((state) => {
        const updated = state.testimonials.filter((t) => t._id !== id && t.id !== id);
        const newIndex = Math.max(0, Math.min(state.currentIndex, updated.length - 1));
        return {
          testimonials: updated,
          currentIndex: newIndex,
          isDeleting: false,
          success: 'Testimonial deleted successfully!',
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

export default useTestimonialStore;
