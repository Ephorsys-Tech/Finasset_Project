import { create } from 'zustand';
import apiClient from '@/lib/axios';

/**
 * Zustand Store for Blog Posts Management (Public & Admin)
 * Handles fetching public articles, category filtering, search, single post reading by slug,
 * and complete Admin CRUD operations with direct Cloudinary asset management via Axios.
 */
export const useBlogStore = create((set, get) => ({
  // State
  posts: [],
  adminPosts: [],
  categories: [],
  selectedCategory: 'All',
  searchQuery: '',
  currentPost: null,
  relatedPosts: [],
  isLoading: false,
  isDetailLoading: false,
  isSaving: false,
  isDeleting: false,
  isUploading: false,
  error: null,
  success: null,

  // Simple state setters
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearCurrentPost: () => set({ currentPost: null, relatedPosts: [] }),
  clearMessages: () => set({ error: null, success: null }),

  /**
   * Fetch public blog posts with optional category and search filters using Axios
   * @param {Object} options - { category, search, limit }
   */
  fetchPosts: async (options = {}) => {
    const category = options.category !== undefined ? options.category : get().selectedCategory;
    const search = options.search !== undefined ? options.search : get().searchQuery;
    const limit = options.limit || 50;

    set({ isLoading: true, error: null });
    try {
      const params = {};
      if (category && category !== 'All') {
        params.category = category;
      }
      if (search && search.trim()) {
        params.search = search.trim();
      }
      if (limit) {
        params.limit = limit;
      }

      const response = await apiClient.get('/api/v1/public/blog', { params });
      const resData = response.data?.data;

      const items = Array.isArray(resData) ? resData : (resData?.posts || []);
      let fetchedCategories = resData?.categories || [];

      if (!fetchedCategories.length && items.length > 0) {
        const catMap = {};
        items.forEach((p) => {
          if (p.category) {
            catMap[p.category] = (catMap[p.category] || 0) + 1;
          }
        });
        fetchedCategories = Object.entries(catMap).map(([name, count]) => ({ name, count }));
      }

      set({
        posts: items,
        categories: fetchedCategories,
        isLoading: false,
      });

      return { posts: items, categories: fetchedCategories };
    } catch (err) {
      console.error('Failed to fetch public blog posts via Axios:', err);
      set({
        posts: [],
        isLoading: false,
        error: err.message || 'Failed to load blog posts',
      });
      return { posts: [], categories: [] };
    }
  },

  /**
   * Fetch a single blog post by its slug (including related articles) using Axios
   * @param {string} slug
   */
  fetchPostBySlug: async (slug) => {
    if (!slug) return null;
    set({ isDetailLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/v1/public/blog/${slug}`);
      const resData = response.data?.data;

      const post = resData?.post || (resData?._id ? resData : null);
      const relatedPosts = resData?.relatedPosts || [];

      set({
        currentPost: post,
        relatedPosts,
        isDetailLoading: false,
      });

      return { post, relatedPosts };
    } catch (err) {
      console.error(`Failed to fetch blog post (${slug}) via Axios:`, err);
      set({
        currentPost: null,
        relatedPosts: [],
        isDetailLoading: false,
        error: err.message || 'Article not found',
      });
      return null;
    }
  },

  /**
   * Fetch all blog posts for the Admin CMS using Axios
   */
  fetchAdminPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/api/v1/admin/blog');
      const data = response.data?.data;
      const list = Array.isArray(data) ? data : [];

      set({
        adminPosts: list,
        isLoading: false,
      });

      return list;
    } catch (err) {
      console.error('Failed to fetch admin blog posts via Axios:', err);
      set({
        adminPosts: [],
        isLoading: false,
        error: err.message || 'Failed to load admin blog posts',
      });
      return [];
    }
  },

  /**
   * Upload an image to Cloudinary via Axios base64 Data URI
   * @param {File} file
   * @returns {Promise<{ imageUrl: string, publicId: string, format: string, width: number, height: number, bytes: number }>}
   */
  uploadImage: async (file) => {
    if (!file) throw new Error('No image file selected');
    if (!file.type || !file.type.startsWith('image/')) {
      throw new Error('Invalid file type! Only image files (PNG, JPG, JPEG, WEBP, SVG, GIF) are allowed.');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB limit. Please upload a smaller image.');
    }

    set({ isUploading: true, error: null });
    try {
      // Convert file to base64 data URI to prevent multipart boundary serialization issues
      const dataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(new Error('Failed to read image file: ' + (e?.message || 'Unknown error')));
        reader.readAsDataURL(file);
      });

      const response = await apiClient.post('/api/v1/admin/blog/upload', {
        file: dataUri,
        filename: file.name,
      });

      const uploadData = response.data?.data;
      if (!uploadData?.imageUrl) {
        throw new Error('Cloudinary did not return a valid image URL');
      }

      set({ isUploading: false });
      return uploadData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Image upload failed';
      set({ isUploading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Delete an image directly from Cloudinary using Axios
   * @param {string} publicId
   */
  deleteImage: async (publicId) => {
    if (!publicId) return;
    try {
      await apiClient.delete(`/api/v1/admin/blog/upload?publicId=${encodeURIComponent(publicId)}`);
    } catch (err) {
      console.warn('Failed to delete image from Cloudinary:', err.message);
    }
  },

  /**
   * Create a new blog post using Axios
   * @param {Object} postData
   */
  createPost: async (postData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.post('/api/v1/admin/blog', postData);
      const createdPost = response.data?.data;

      set((state) => ({
        adminPosts: [createdPost, ...state.adminPosts],
        posts: createdPost.isPublished ? [createdPost, ...state.posts] : state.posts,
        isSaving: false,
        success: 'Blog article published successfully!',
      }));

      return createdPost;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create blog post';
      set({ isSaving: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Update an existing blog post using Axios
   * @param {string} id
   * @param {Object} postData
   */
  updatePost: async (id, postData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.put('/api/v1/admin/blog', {
        id,
        ...postData,
      });
      const updatedPost = response.data?.data;

      set((state) => ({
        adminPosts: state.adminPosts.map((p) =>
          p._id === id || p.id === id ? { ...p, ...postData, ...updatedPost } : p
        ),
        posts: state.posts.map((p) =>
          p._id === id || p.id === id ? { ...p, ...postData, ...updatedPost } : p
        ),
        currentPost:
          state.currentPost?._id === id || state.currentPost?.slug === updatedPost.slug
            ? updatedPost
            : state.currentPost,
        isSaving: false,
        success: 'Blog article updated successfully!',
      }));

      return updatedPost;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update blog post';
      set({ isSaving: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Delete a blog post and its associated Cloudinary image using Axios
   * @param {string} id
   */
  deletePost: async (id) => {
    set({ isDeleting: true, error: null, success: null });
    try {
      await apiClient.delete(`/api/v1/admin/blog?id=${id}`);

      set((state) => ({
        adminPosts: state.adminPosts.filter((p) => p._id !== id && p.id !== id),
        posts: state.posts.filter((p) => p._id !== id && p.id !== id),
        isDeleting: false,
        success: 'Blog article deleted successfully!',
      }));

      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete blog post';
      set({ isDeleting: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },
}));

export default useBlogStore;
