import { contentService } from '@/backend/services/contentService';
import { sendSuccess, sendError, sendBadRequest, sendNotFound } from '@/backend/utils/apiResponse';
import { authenticateAdmin } from '@/backend/middleware/authMiddleware';

export const contentController = {
  // Settings
  async getSettings() {
    try {
      const settings = await contentService.getSettings();
      return sendSuccess(settings);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateSettings(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      const settings = await contentService.updateSettings(body, auth.admin.email, req);
      return sendSuccess(settings, 'Site settings updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  // Menus
  async getMenus() {
    try {
      const menus = await contentService.getMenus();
      return sendSuccess(menus);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateMenu(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const code = url.searchParams.get('code') || 'header';
      const body = await req.json().catch(() => ({}));
      const menu = await contentService.updateMenu(code, body, auth.admin.email, req);
      return sendSuccess(menu, 'Menu updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  // Blog Posts
  async getBlogPosts(req) {
    try {
      const url = new URL(req.url);
      const category = url.searchParams.get('category') || '';
      const search = url.searchParams.get('search') || '';
      const limit = url.searchParams.get('limit') || 50;
      const posts = await contentService.getBlogPosts({ category, search, limit });

      // Aggregate categories from published posts
      const allPosts = await contentService.getBlogPosts({ limit: 100 });
      const categoryCounts = {};
      allPosts.forEach((p) => {
        if (p.category) {
          categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        }
      });
      const categories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
      }));

      return sendSuccess({ posts, categories });
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getBlogPostBySlug(slug) {
    try {
      const post = await contentService.getBlogPostBySlug(slug);
      let relatedPosts = [];
      try {
        const related = await contentService.getBlogPosts({ category: post.category, limit: 4 });
        relatedPosts = related.filter((r) => r.slug !== post.slug).slice(0, 3);
      } catch {
        relatedPosts = [];
      }
      return sendSuccess({ post, relatedPosts });
    } catch {
      return sendNotFound('Blog post not found');
    }
  },

  async getAllBlogPostsAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const posts = await contentService.getAllBlogPostsAdmin();
      return sendSuccess(posts);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createBlogPost(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.title || !body.slug) return sendBadRequest('Title and slug required');
      const post = await contentService.createBlogPost(body, auth.admin.email, req);
      return sendSuccess(post, 'Article published successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateBlogPost(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const body = await req.json().catch(() => ({}));
      const id = url.searchParams.get('id') || body.id || body._id;
      if (!id) return sendBadRequest('Post ID required');

      const post = await contentService.updateBlogPost(id, body, auth.admin.email, req);
      return sendSuccess(post, 'Article updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteBlogPost(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      let id = url.searchParams.get('id');
      if (!id) {
        const body = await req.json().catch(() => ({}));
        id = body.id || body._id;
      }
      if (!id) return sendBadRequest('Post ID required');

      await contentService.deleteBlogPost(id, auth.admin.email, req);
      return sendSuccess(null, 'Article deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  // Pages
  async getPageBySlug(slug) {
    try {
      const page = await contentService.getPageBySlug(slug);
      return sendSuccess(page);
    } catch {
      return sendNotFound('Page not found');
    }
  },

  async getAllPagesAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const pages = await contentService.getAllPagesAdmin();
      return sendSuccess(pages);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createPage(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.title || !body.slug) return sendBadRequest('Title and slug required');
      const page = await contentService.createPage(body, auth.admin.email, req);
      return sendSuccess(page, 'Page created successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updatePage(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return sendBadRequest('Page ID required');

      const body = await req.json().catch(() => ({}));
      const page = await contentService.updatePage(id, body, auth.admin.email, req);
      return sendSuccess(page, 'Page updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deletePage(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return sendBadRequest('Page ID required');

      await contentService.deletePage(id, auth.admin.email, req);
      return sendSuccess(null, 'Page deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  // Testimonials
  async getTestimonials() {
    try {
      const list = await contentService.getTestimonials();
      return sendSuccess(list);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getAllTestimonialsAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const list = await contentService.getAllTestimonialsAdmin();
      return sendSuccess(list);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createTestimonial(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      const text = body.reviewText || body.quote;
      if (!body.clientName?.trim() || !text?.trim()) {
        return sendBadRequest('Client name and review text required');
      }
      const payload = {
        ...body,
        clientName: body.clientName.trim(),
        reviewText: text.trim(),
        quote: text.trim(),
      };
      const t = await contentService.createTestimonial(payload, auth.admin.email, req);
      return sendSuccess(t, 'Testimonial added successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateTestimonial(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      let id = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      if (!id) id = body.id || body._id;
      if (!id) return sendBadRequest('Testimonial ID required');

      const text = body.reviewText !== undefined ? body.reviewText : body.quote;
      const payload = {
        ...body,
        ...(text !== undefined ? { reviewText: text.trim(), quote: text.trim() } : {}),
      };
      delete payload.id;
      delete payload._id;

      const t = await contentService.updateTestimonial(id, payload, auth.admin.email, req);
      return sendSuccess(t, 'Testimonial updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deleteTestimonial(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      let id = url.searchParams.get('id');
      if (!id) {
        const body = await req.json().catch(() => ({}));
        id = body.id || body._id;
      }
      if (!id) return sendBadRequest('Testimonial ID required');

      await contentService.deleteTestimonial(id, auth.admin.email, req);
      return sendSuccess(null, 'Testimonial deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  // Partners
  async getPartners() {
    try {
      const list = await contentService.getPartners();
      return sendSuccess(list);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async getAllPartnersAdmin(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const list = await contentService.getAllPartnersAdmin();
      return sendSuccess(list);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async createPartner(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      if (!body.name && !body.imageUrl && !body.logoUrl) {
        return sendBadRequest('Partner image or name is required');
      }
      if (!body.name || !body.name.trim()) {
        body.name = 'Client Partner';
      }
      const p = await contentService.createPartner(body, auth.admin.email, req);
      return sendSuccess(p, 'Partner added successfully', 201);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updatePartner(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      const body = await req.json().catch(() => ({}));
      const id = queryId || body.id || body._id;
      if (!id) return sendBadRequest('Partner ID is required');

      if (!body.name || !body.name.trim()) {
        body.name = 'Client Partner';
      }

      const p = await contentService.updatePartner(id, body, auth.admin.email, req);
      return sendSuccess(p, 'Partner updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async deletePartner(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const url = new URL(req.url);
      const queryId = url.searchParams.get('id');
      let bodyId = null;
      if (!queryId) {
        const body = await req.json().catch(() => ({}));
        bodyId = body.id || body._id;
      }
      const id = queryId || bodyId;
      if (!id) return sendBadRequest('Partner ID is required');

      await contentService.deletePartner(id, auth.admin.email, req);
      return sendSuccess(null, 'Partner deleted successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  // Market Data
  async getMarketData() {
    try {
      const data = await contentService.getMarketData();
      return sendSuccess(data);
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },

  async updateMarketNews(req) {
    const auth = await authenticateAdmin(req);
    if (!auth.success) return auth.response;

    try {
      const body = await req.json().catch(() => ({}));
      await contentService.updateMarketNews(body, auth.admin.email, req);
      return sendSuccess(null, 'Market indices and news updated successfully');
    } catch (err) {
      return sendError(err.message, 500, err);
    }
  },
};

export default contentController;
