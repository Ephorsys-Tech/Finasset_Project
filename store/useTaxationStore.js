import { create } from 'zustand';
import apiClient from '@/lib/axios';

/**
 * Zustand Store for Taxation State Management (Public & Admin)
 * Handles fetching published topics, admin CRUD operations, order shifting,
 * and publish toggling via Axios.
 */
export const useTaxationStore = create((set, get) => ({
  // State
  items: [], // Public published taxation topics
  adminItems: [], // All taxation topics for admin panel (including drafts/unpublished)
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  success: null,

  /**
   * Clear notifications or errors
   */
  clearMessages: () => set({ error: null, success: null }),

  /**
   * Fetch Taxation topics using Axios
   * @param {boolean} isAdmin - Whether to fetch all topics (admin) or published only (public)
   */
  fetchItems: async (isAdmin = false) => {
    // Return cached items if public and already fetched
    if (!isAdmin && get().items.length > 0) {
      return get().items;
    }

    set({ isLoading: true, error: null });
    try {
      const endpoint = isAdmin ? '/api/v1/admin/taxation' : '/api/v1/public/taxation';
      const response = await apiClient.get(endpoint);
      const data = response.data?.data || [];
      const list = Array.isArray(data) ? data : [];

      if (isAdmin) {
        set({
          adminItems: list,
          isLoading: false,
        });
      } else {
        set({
          items: list,
          isLoading: false,
        });
      }
      return list;
    } catch (err) {
      console.warn('Failed to fetch Taxation items via Axios:', err.message);
      set({
        isLoading: false,
        error: err.message || 'Failed to load Taxation items',
      });
      return isAdmin ? get().adminItems : get().items;
    }
  },

  /**
   * Create a new Taxation topic using Axios
   * @param {Object} itemData
   */
  createItem: async (itemData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.post('/api/v1/admin/taxation', itemData);
      const created = response.data?.data;

      set((state) => ({
        adminItems: [...state.adminItems, created],
        items: created.isPublished !== false ? [...state.items, created] : state.items,
        isSaving: false,
        success: 'New Taxation topic added successfully!',
      }));

      return created;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create taxation topic';
      set({ isSaving: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Update an existing Taxation topic using Axios
   * @param {string} id
   * @param {Object} itemData
   */
  updateItem: async (id, itemData) => {
    set({ isSaving: true, error: null, success: null });
    try {
      const response = await apiClient.put(`/api/v1/admin/taxation?id=${id}`, {
        id,
        ...itemData,
      });
      const updated = response.data?.data;

      set((state) => ({
        adminItems: state.adminItems.map((i) =>
          i._id === id || i.id === id ? { ...i, ...itemData, ...updated } : i
        ),
        items: state.items.map((i) =>
          i._id === id || i.id === id ? { ...i, ...itemData, ...updated } : i
        ),
        isSaving: false,
        success: 'Taxation topic updated successfully!',
      }));

      return updated;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update taxation topic';
      set({ isSaving: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Toggle the publish status of a Taxation topic using Axios
   * @param {Object} item
   */
  togglePublish: async (item) => {
    const id = item._id || item.id;
    const nextStatus = !item.isPublished;
    try {
      const response = await apiClient.put(`/api/v1/admin/taxation?id=${id}`, {
        id,
        isPublished: nextStatus,
      });
      const updated = response.data?.data;

      set((state) => {
        const updatedAdmin = state.adminItems.map((i) =>
          i._id === id || i.id === id ? { ...i, isPublished: nextStatus } : i
        );
        let updatedPublic = state.items;
        if (nextStatus) {
          if (!updatedPublic.some((i) => i._id === id || i.id === id)) {
            updatedPublic = [...updatedPublic, updated || { ...item, isPublished: nextStatus }];
          }
        } else {
          updatedPublic = updatedPublic.filter((i) => i._id !== id && i.id !== id);
        }
        return {
          adminItems: updatedAdmin,
          items: updatedPublic,
        };
      });
      return true;
    } catch (err) {
      console.warn('Failed to toggle publish status via Axios:', err.message);
      throw err;
    }
  },

  /**
   * Swap display orders of two items using Axios
   * @param {Object} item1
   * @param {Object} item2
   */
  swapOrder: async (item1, item2) => {
    try {
      await Promise.all([
        apiClient.put(`/api/v1/admin/taxation?id=${item1._id}`, { id: item1._id, order: item1.order }),
        apiClient.put(`/api/v1/admin/taxation?id=${item2._id}`, { id: item2._id, order: item2.order }),
      ]);

      set((state) => {
        const updated = state.adminItems.map((i) => {
          if (i._id === item1._id) return { ...i, order: item1.order };
          if (i._id === item2._id) return { ...i, order: item2.order };
          return i;
        });
        updated.sort((a, b) => (a.order || 0) - (b.order || 0));
        return { adminItems: updated };
      });
      return true;
    } catch (err) {
      console.warn('Failed to update topic order via Axios:', err.message);
      throw err;
    }
  },

  /**
   * Delete a Taxation topic using Axios
   * @param {string} id
   */
  deleteItem: async (id) => {
    set({ isDeleting: true, error: null, success: null });
    try {
      await apiClient.delete(`/api/v1/admin/taxation?id=${id}`);

      set((state) => ({
        adminItems: state.adminItems.filter((i) => i._id !== id && i.id !== id),
        items: state.items.filter((i) => i._id !== id && i.id !== id),
        isDeleting: false,
        success: 'Taxation topic deleted successfully!',
      }));

      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete taxation topic';
      set({ isDeleting: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },
}));

export default useTaxationStore;
