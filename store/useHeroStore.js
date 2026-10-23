import { create } from 'zustand';
import apiClient from '@/lib/axios';

/**
 * Zustand Store for Homepage Hero Banner Slider Management
 * Handles fetching, direct Cloudinary file uploading, saving, and deletion of slides
 * and their associated Cloudinary images via Axios.
 */
export const useHeroStore = create((set, get) => ({
  slides: [],
  isLoading: false,
  isUploading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  success: null,

  /**
   * Fetch all hero slides (admin) using Axios
   */
  fetchSlides: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/api/v1/admin/home');
      const data = response.data?.data;
      const list = data?.heroSlides || (Array.isArray(data) ? data : []);

      set({
        slides: list,
        isLoading: false,
      });
      return list;
    } catch (err) {
      console.warn('Failed to fetch hero slides via Axios:', err.message);
      set({
        slides: [],
        isLoading: false,
        error: err.message || 'Failed to load hero slides',
      });
      return [];
    }
  },

  /**
   * Fetch active public hero slides for the homepage using Axios
   */
  fetchPublicSlides: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/api/v1/public/home');
      const data = response.data?.data;
      const list = data?.heroSlides || [];
      const activeList = Array.isArray(list) ? list.filter((s) => s.isActive !== false) : [];

      set({
        slides: activeList,
        isLoading: false,
      });
      return activeList;
    } catch (err) {
      console.warn('Failed to fetch public hero slides via Axios:', err.message);
      set({
        slides: [],
        isLoading: false,
        error: err.message || 'Failed to load hero slides',
      });
      return [];
    }
  },

  /**
   * Upload hero banner image to Cloudinary using Axios
   * @param {File} file - Image file from computer
   * @returns {Promise<{ imageUrl: string, publicId: string }>}
   */
  uploadImage: async (file) => {
    if (!file) throw new Error('No image file selected');
    if (!file.type || !file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG).');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image file is too large. Maximum allowed size is 10MB.');
    }

    set({ isUploading: true, error: null });
    try {
      // Convert to base64 dataUri
      const dataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await apiClient.post('/api/v1/admin/hero-slides/upload', {
        file: dataUri,
        filename: file.name,
      });

      const result = response.data?.data;
      if (!result?.imageUrl) {
        throw new Error('Cloudinary did not return an image URL.');
      }

      set({ isUploading: false });
      return {
        imageUrl: result.imageUrl,
        publicId: result.publicId || '',
      };
    } catch (err) {
      set({ isUploading: false, error: err.message || 'Image upload failed' });
      throw err;
    }
  },

  /**
   * Delete uploaded image from Cloudinary
   */
  deleteUploadedImage: async (publicId) => {
    if (!publicId) return;
    try {
      await apiClient.delete(`/api/v1/admin/hero-slides/upload?publicId=${encodeURIComponent(publicId)}`);
    } catch (err) {
      console.warn('Failed to delete temp Cloudinary image:', err.message);
    }
  },

  /**
   * Create a single new hero slide
   */
  createSlide: async (slideData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.post('/api/v1/admin/home', slideData);
      const created = response.data?.data;

      set((state) => ({
        slides: [...state.slides, created],
        isSaving: false,
        success: 'Hero slide created successfully!',
      }));
      return created;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Update an existing hero slide by ID
   */
  updateSlide: async (id, slideData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.put(`/api/v1/admin/home?id=${id}`, slideData);
      const updated = response.data?.data;

      set((state) => ({
        slides: state.slides.map((s) => (s._id === id || s.id === id ? { ...s, ...slideData, ...updated } : s)),
        isSaving: false,
        success: 'Hero slide updated successfully!',
      }));
      return updated;
    } catch (err) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  /**
   * Delete a hero slide by ID
   * Server also removes the associated Cloudinary image!
   */
  deleteSlide: async (id) => {
    set({ isDeleting: true, error: null, success: null });
    try {
      await apiClient.delete(`/api/v1/admin/home?id=${id}`);

      set((state) => ({
        slides: state.slides.filter((s) => s._id !== id && s.id !== id),
        isDeleting: false,
        success: 'Hero slide and image deleted successfully!',
      }));
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

export default useHeroStore;
