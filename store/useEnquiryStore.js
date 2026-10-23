import { create } from 'zustand';
import apiClient from '@/lib/axios';

/**
 * Zustand Store for Enquiry and Callback Request Management
 * Connects public callback/enquiry forms with the backend and Admin Enquiry Panel using Axios.
 */
export const useEnquiryStore = create((set, get) => ({
  // Public submission state
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
  trackingNumber: null,
  lastSubmittedEnquiry: null,

  // Admin management state
  enquiries: [],
  pagination: { page: 1, totalPages: 1, total: 0 },
  isLoadingAdmin: false,
  adminError: null,

  /**
   * Submit an enquiry or callback request using Axios
   * @param {Object} enquiryData - Data including name, phone, email, serviceOfInterest, preferredTime, message, type, sourcePage
   */
  submitEnquiry: async (enquiryData) => {
    set({ isSubmitting: true, submitError: null, submitSuccess: false });
    try {
      const payload = {
        name: (enquiryData.name || '').trim(),
        phone: (enquiryData.phone || '').trim(),
        email: (enquiryData.email || '').trim(),
        country: enquiryData.country || 'India',
        type: enquiryData.type || 'callback',
        serviceOfInterest: enquiryData.serviceOfInterest || 'General Wealth Advisory',
        preferredTime: enquiryData.preferredTime || 'Anytime',
        message: (enquiryData.message || '').trim(),
        sourcePage: enquiryData.sourcePage || 'Homepage Call Back Form',
      };

      const response = await apiClient.post('/api/v1/public/enquiry', payload);
      const resData = response.data;
      const tracking = resData?.data?.trackingNumber || null;

      set({
        isSubmitting: false,
        submitSuccess: true,
        submitError: null,
        trackingNumber: tracking,
        lastSubmittedEnquiry: resData?.data || null,
      });

      return {
        success: true,
        trackingNumber: tracking,
        data: resData?.data,
        message: resData?.message || 'Enquiry submitted successfully',
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Unable to submit request. Please try again or contact us directly.';

      set({
        isSubmitting: false,
        submitSuccess: false,
        submitError: errorMsg,
      });

      return {
        success: false,
        error: errorMsg,
      };
    }
  },

  /**
   * Specific helper to submit a Call Back request
   * @param {Object} callbackData - Form data from CallbackForm
   */
  submitCallback: async (callbackData) => {
    return get().submitEnquiry({
      ...callbackData,
      type: 'callback',
      sourcePage: callbackData.sourcePage || 'Homepage Call Back Form',
    });
  },

  /**
   * Set form submission error manually (e.g. for client-side validations like captcha)
   */
  setSubmitError: (errorMessage) => {
    set({ submitError: errorMessage });
  },

  /**
   * Clear submission status and reset form state
   */
  resetStatus: () => {
    set({
      isSubmitting: false,
      submitSuccess: false,
      submitError: null,
      trackingNumber: null,
      lastSubmittedEnquiry: null,
    });
  },

  /**
   * Admin: Fetch enquiries using Axios
   */
  fetchAdminEnquiries: async ({ page = 1, status = 'ALL', type = 'ALL', search = '' } = {}) => {
    set({ isLoadingAdmin: true, adminError: null });
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (status && status !== 'ALL') params.append('status', status);
      if (type && type !== 'ALL') params.append('type', type);
      if (search && search.trim()) params.append('search', search.trim());

      const response = await apiClient.get(`/api/v1/admin/enquiries?${params.toString()}`);
      const data = response.data?.data || {};

      set({
        enquiries: data.enquiries || [],
        pagination: data.pagination || {
          page: data.page || 1,
          totalPages: data.totalPages || 1,
          total: data.total || 0,
        },
        isLoadingAdmin: false,
      });
      return data;
    } catch (err) {
      set({
        isLoadingAdmin: false,
        adminError: err.message || 'Failed to fetch enquiries',
      });
      return null;
    }
  },
}));

export default useEnquiryStore;
