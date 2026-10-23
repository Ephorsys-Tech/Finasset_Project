import { create } from 'zustand';
import apiClient from '@/lib/axios';
import { fallbackMarketIndices } from '@/lib/fallbackData';

/**
 * Zustand Store for News & Market Feed State Management
 * Handles fetching, active news selection, admin CRUD operations, and Cloudinary image handling via Axios.
 */
export const useNewsStore = create((set, get) => ({
  newsItems: [],
  indices: [],
  selectedNewsIndex: 0,
  activeNews: null,
  isLoading: false,
  isSaving: false,
  isUploading: false,
  error: null,
  success: null,

  /**
   * Set active news item by index
   */
  selectNews: (index) => {
    const { newsItems } = get();
    if (!newsItems || newsItems.length === 0) {
      set({ selectedNewsIndex: 0, activeNews: null });
      return;
    }
    const safeIndex = Math.max(0, Math.min(index, newsItems.length - 1));
    set({
      selectedNewsIndex: safeIndex,
      activeNews: newsItems[safeIndex] || null,
    });
  },

  /**
   * Fetch news items from backend using Axios
   * @param {boolean} isAdmin - Whether to fetch from admin endpoint (all items) or public endpoint (published only)
   */
  fetchNews: async (isAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = isAdmin ? '/api/v1/admin/market-news' : '/api/v1/public/news';
      const response = await apiClient.get(endpoint);
      const json = response.data;

      let items = [];
      let fetchedIndices = [];

      if (isAdmin) {
        items = json?.data?.newsItems || json?.data?.news || [];
        fetchedIndices = json?.data?.indices || [];
      } else {
        items = json?.data || [];
      }

      items = Array.isArray(items) ? items : [];

      if (!fetchedIndices || fetchedIndices.length === 0) {
        fetchedIndices = fallbackMarketIndices;
      }

      const currentIndex = get().selectedNewsIndex;
      const safeIndex = items[currentIndex] ? currentIndex : 0;

      set({
        newsItems: items,
        indices: fetchedIndices,
        selectedNewsIndex: safeIndex,
        activeNews: items.length > 0 ? (items[safeIndex] || items[0]) : null,
        isLoading: false,
      });
      return items;
    } catch (err) {
      console.error('Failed to fetch news:', err);
      set({
        newsItems: [],
        indices: fallbackMarketIndices,
        activeNews: null,
        error: err.message,
        isLoading: false,
      });
      return [];
    }
  },

  /**
   * Upload an image to Cloudinary using Axios via base64 Data URI
   * @param {File} file
   * @returns {Promise<{ imageUrl: string, publicId: string, publicUrl: string }>}
   */
  uploadImage: async (file) => {
    set({ isUploading: true, error: null });
    try {
      // Convert file to base64 data URI to prevent Axios multipart boundary issues across environments
      const dataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(new Error('Failed to read image file: ' + (err?.message || 'Unknown error')));
        reader.readAsDataURL(file);
      });

      const response = await apiClient.post('/api/v1/admin/market-news/upload', {
        file: dataUri,
        filename: file.name,
      });

      const uploadData = response.data?.data;
      set({ isUploading: false });
      return uploadData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Image upload failed';
      set({ isUploading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Delete an image from Cloudinary using Axios
   * @param {string} publicId
   */
  deleteImage: async (publicId) => {
    if (!publicId) return;
    try {
      await apiClient.delete(`/api/v1/admin/market-news/upload?publicId=${encodeURIComponent(publicId)}`);
    } catch (err) {
      console.warn('Failed to delete image from Cloudinary:', err.message);
    }
  },

  /**
   * Create a new news story using Axios
   * @param {Object} newsData
   */
  createNews: async (newsData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.post('/api/v1/admin/market-news', newsData);
      const createdItem = response.data?.data;

      set((state) => {
        const updated = [createdItem, ...state.newsItems];
        return {
          newsItems: updated,
          activeNews: updated[0],
          selectedNewsIndex: 0,
          isSaving: false,
          success: 'News story published successfully!',
        };
      });

      return createdItem;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Update an existing news story using Axios
   * @param {string} id
   * @param {Object} newsData
   */
  updateNews: async (id, newsData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.put('/api/v1/admin/market-news', {
        id,
        ...newsData,
      });
      const updatedItem = response.data?.data;

      set((state) => {
        const updated = state.newsItems.map((item) =>
          item._id === id || item.id === id ? updatedItem : item
        );
        const currentActive = updated.find((item) => item._id === id) || updated[state.selectedNewsIndex];
        return {
          newsItems: updated,
          activeNews: currentActive,
          isSaving: false,
          success: 'News story updated successfully!',
        };
      });

      return updatedItem;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Delete a news story from DB (and remote Cloudinary asset) using Axios
   * @param {string} id
   */
  deleteNews: async (id) => {
    set({ isSaving: true, error: null, success: null });
    try {
      await apiClient.delete(`/api/v1/admin/market-news?id=${id}`);

      set((state) => {
        const updated = state.newsItems.filter((item) => item._id !== id && item.id !== id);
        const newIndex = Math.max(0, Math.min(state.selectedNewsIndex, updated.length - 1));
        return {
          newsItems: updated,
          selectedNewsIndex: newIndex,
          activeNews: updated[newIndex] || null,
          isSaving: false,
          success: 'News story deleted successfully!',
        };
      });

      return true;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Clear error or success messages
   */
  clearMessages: () => {
    set({ error: null, success: null });
  },
}));

export default useNewsStore;
