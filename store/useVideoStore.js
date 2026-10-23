import { create } from 'zustand';
import apiClient from '@/lib/axios';
import { fallbackFinancialVideo } from '@/lib/fallbackData';

/**
 * Zustand Store for YouTube Financial Video Management
 * Connects the Media Library YouTube link upload section with VideoShowcase on the homepage.
 * Strictly limits to a maximum of 4 videos.
 */
export const useVideoStore = create((set, get) => ({
  videos: [],
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  success: null,

  /**
   * Set videos directly (e.g. from homepage initialVideos)
   */
  setVideos: (videos) => {
    if (Array.isArray(videos) && videos.length > 0) {
      set({ videos: videos.slice(0, 4) });
    }
  },

  /**
   * Fetch videos using Axios
   * @param {boolean} isAdmin - Whether to fetch from admin endpoint (all) or public
   */
  fetchVideos: async (isAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = isAdmin ? '/api/v1/admin/videos' : '/api/v1/public/videos';
      const response = await apiClient.get(endpoint);
      const data = response.data?.data || response.data || [];
      const items = Array.isArray(data) ? data.slice(0, 4) : [];

      set({
        videos: items,
        isLoading: false,
      });
      return items;
    } catch (err) {
      console.warn('Failed to fetch videos via Axios:', err.message);
      set({
        isLoading: false,
        error: err.message,
      });
      return get().videos;
    }
  },

  /**
   * Create / upload a YouTube video link
   * Strictly enforces MAX 4 VIDEOS limit
   */
  createVideo: async (payload) => {
    const currentVideos = get().videos;
    if (currentVideos.length >= 4) {
      const limitError = 'Maximum limit reached: You can only upload up to 4 videos. Please delete an existing video to add a new one.';
      set({ error: limitError });
      throw new Error(limitError);
    }

    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.post('/api/v1/admin/videos', payload);
      const created = response.data?.data;

      set((state) => {
        const updated = [...state.videos, created].slice(0, 4);
        return {
          videos: updated,
          isSaving: false,
          success: 'YouTube video added successfully!',
        };
      });
      return created;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Update an existing video link
   */
  updateVideo: async (id, payload) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.put(`/api/v1/admin/videos?id=${id}`, payload);
      const updatedItem = response.data?.data;

      set((state) => {
        const updated = state.videos.map((v) =>
          v._id === id || v.id === id ? { ...v, ...payload, ...updatedItem } : v
        );
        return {
          videos: updated,
          isSaving: false,
          success: 'Video updated successfully!',
        };
      });
      return updatedItem;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Delete a video link
   */
  deleteVideo: async (id) => {
    set({ isDeleting: true, error: null, success: null });
    try {
      await apiClient.delete(`/api/v1/admin/videos?id=${id}`);

      set((state) => {
        const updated = state.videos.filter((v) => v._id !== id && v.id !== id);
        return {
          videos: updated,
          isDeleting: false,
          success: 'Video deleted successfully!',
        };
      });
      return true;
    } catch (err) {
      set({ isDeleting: false, error: err.message });
      throw err;
    }
  },

  /**
   * Clear error and success messages
   */
  clearMessages: () => {
    set({ error: null, success: null });
  },
}));

export default useVideoStore;
