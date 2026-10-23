import { connectToDatabase } from '@/backend/config/db';
import SiteSettings from '@/backend/models/SiteSettings';
import Menu from '@/backend/models/Menu';
import BlogPost from '@/backend/models/BlogPost';
import Page from '@/backend/models/Page';
import Testimonial from '@/backend/models/Testimonial';
import Partner from '@/backend/models/Partner';
import MarketIndex from '@/backend/models/MarketIndex';
import NewsItem from '@/backend/models/NewsItem';
import { logAdminActivity } from '@/backend/lib/auth';
import {
  fallbackTestimonials,
  fallbackPartners,
  fallbackMarketIndices,
  fallbackNewsItems,
} from '@/lib/fallbackData';
import { cloudinary } from '@/backend/config/cloudinary';

const extractCloudinaryPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
    return publicId || null;
  } catch {
    return null;
  }
};

const deleteCloudinaryAsset = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Failed to delete asset from Cloudinary:', err?.message || err);
  }
};

export const contentService = {
  // Settings
  async getSettings() {
    try {
      await connectToDatabase();
      const settings = await SiteSettings.findOne({}).lean();
      return settings || {};
    } catch {
      return {};
    }
  },

  async updateSettings(data, adminEmail, req) {
    await connectToDatabase();
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create(data);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, { $set: data }, { new: true });
    }

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_SITE_SETTINGS',
      entity: 'SiteSettings',
      entityId: settings._id,
      summary: `Updated global site settings and contact parameters.`,
      req,
    });
    return settings;
  },

  // Menus
  async getMenus() {
    try {
      await connectToDatabase();
      return Menu.find({ isActive: true }).sort({ code: 1 }).lean();
    } catch {
      return [];
    }
  },

  async updateMenu(code, data, adminEmail, req) {
    await connectToDatabase();
    const menu = await Menu.findOneAndUpdate({ code }, { $set: data }, { new: true, upsert: true });
    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_MENU',
      entity: 'Menu',
      entityId: menu._id,
      summary: `Updated menu: ${code}`,
      req,
    });
    return menu;
  },

  // Blog Posts
  async getBlogPosts({ category = '', search = '', limit = 10 } = {}) {
    try {
      await connectToDatabase();
      const query = { isPublished: true };
      if (category) query.category = category;
      if (search) query.title = { $regex: search, $options: 'i' };
      return BlogPost.find(query).sort({ publishedAt: -1 }).limit(Number(limit)).lean();
    } catch {
      return [];
    }
  },

  async getBlogPostBySlug(slug) {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
    if (!post) throw new Error('Blog post not found');
    return post;
  },

  async getAllBlogPostsAdmin() {
    await connectToDatabase();
    return BlogPost.find({}).sort({ publishedAt: -1 }).lean();
  },

  async createBlogPost(data, adminEmail, req) {
    await connectToDatabase();
    if (data.description && !data.content) {
      data.content = data.description;
    } else if (data.content && !data.description) {
      data.description = data.content;
    }
    if (!data.excerpt && (data.description || data.content)) {
      const plain = (data.description || data.content).replace(/[#*`_\[\]]/g, '').trim();
      data.excerpt = plain.length > 160 ? plain.substring(0, 157) + '...' : plain;
    }

    const post = await BlogPost.create(data);
    await logAdminActivity({
      adminEmail,
      action: 'CREATE_BLOG_POST',
      entity: 'BlogPost',
      entityId: post._id,
      summary: `Published blog article: ${post.title}`,
      req,
    });
    return post;
  },

  async updateBlogPost(id, data, adminEmail, req) {
    await connectToDatabase();
    const existing = await BlogPost.findById(id);
    if (!existing) throw new Error('Post not found');

    if (data.description && !data.content) {
      data.content = data.description;
    } else if (data.content && !data.description) {
      data.description = data.content;
    }
    if (!data.excerpt && (data.description || data.content)) {
      const plain = (data.description || data.content).replace(/[#*`_\[\]]/g, '').trim();
      data.excerpt = plain.length > 160 ? plain.substring(0, 157) + '...' : plain;
    }

    // Clean up previous image on Cloudinary if replaced or removed
    if (
      existing.featuredImagePublicId &&
      data.featuredImagePublicId !== undefined &&
      existing.featuredImagePublicId !== data.featuredImagePublicId
    ) {
      await deleteCloudinaryAsset(existing.featuredImagePublicId);
    } else if (
      !existing.featuredImagePublicId &&
      existing.featuredImage &&
      data.featuredImage !== undefined &&
      existing.featuredImage !== data.featuredImage
    ) {
      const oldPublicId = extractCloudinaryPublicId(existing.featuredImage);
      if (oldPublicId) await deleteCloudinaryAsset(oldPublicId);
    }

    const post = await BlogPost.findByIdAndUpdate(id, { $set: data }, { new: true });
    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_BLOG_POST',
      entity: 'BlogPost',
      entityId: id,
      summary: `Updated blog article: ${post.title}`,
      req,
    });
    return post;
  },

  async deleteBlogPost(id, adminEmail, req) {
    await connectToDatabase();
    const post = await BlogPost.findById(id);
    if (!post) throw new Error('Post not found');

    // Clean up image from Cloudinary when blog post is deleted
    if (post.featuredImagePublicId) {
      await deleteCloudinaryAsset(post.featuredImagePublicId);
    } else if (post.featuredImage) {
      const publicId = extractCloudinaryPublicId(post.featuredImage);
      if (publicId) await deleteCloudinaryAsset(publicId);
    }

    await BlogPost.findByIdAndDelete(id);
    await logAdminActivity({
      adminEmail,
      action: 'DELETE_BLOG_POST',
      entity: 'BlogPost',
      entityId: id,
      summary: `Deleted blog article: ${post.title}`,
      req,
    });
    return true;
  },

  // Pages
  async getPageBySlug(slug) {
    await connectToDatabase();
    const page = await Page.findOne({ slug, isPublished: true }).lean();
    if (!page) throw new Error('Page not found');
    return page;
  },

  async getAllPagesAdmin() {
    await connectToDatabase();
    return Page.find({}).sort({ title: 1 }).lean();
  },

  async createPage(data, adminEmail, req) {
    await connectToDatabase();
    const page = await Page.create(data);
    await logAdminActivity({
      adminEmail,
      action: 'CREATE_PAGE',
      entity: 'Page',
      entityId: page._id,
      summary: `Created page: ${page.title}`,
      req,
    });
    return page;
  },

  async updatePage(id, data, adminEmail, req) {
    await connectToDatabase();
    const page = await Page.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!page) throw new Error('Page not found');
    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_PAGE',
      entity: 'Page',
      entityId: id,
      summary: `Updated page: ${page.title}`,
      req,
    });
    return page;
  },

  async deletePage(id, adminEmail, req) {
    await connectToDatabase();
    const page = await Page.findByIdAndDelete(id);
    if (!page) throw new Error('Page not found');
    await logAdminActivity({
      adminEmail,
      action: 'DELETE_PAGE',
      entity: 'Page',
      entityId: id,
      summary: `Deleted page: ${page.title}`,
      req,
    });
    return true;
  },

  // Testimonials
  async getTestimonials() {
    try {
      await connectToDatabase();
      const list = await Testimonial.find({ isPublished: true }).sort({ order: 1 }).lean();
      return (list && list.length) ? list : fallbackTestimonials;
    } catch {
      return fallbackTestimonials;
    }
  },

  async getAllTestimonialsAdmin() {
    await connectToDatabase();
    return Testimonial.find({}).sort({ order: 1 }).lean();
  },

  async createTestimonial(data, adminEmail, req) {
    await connectToDatabase();
    const t = await Testimonial.create(data);
    await logAdminActivity({
      adminEmail,
      action: 'CREATE_TESTIMONIAL',
      entity: 'Testimonial',
      entityId: t._id,
      summary: `Added testimonial from: ${t.clientName}`,
      req,
    });
    return t;
  },

  async updateTestimonial(id, data, adminEmail, req) {
    await connectToDatabase();
    const t = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!t) throw new Error('Testimonial not found');
    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_TESTIMONIAL',
      entity: 'Testimonial',
      entityId: id,
      summary: `Updated testimonial: ${t.clientName}`,
      req,
    });
    return t;
  },

  async deleteTestimonial(id, adminEmail, req) {
    await connectToDatabase();
    const t = await Testimonial.findByIdAndDelete(id);
    if (!t) throw new Error('Testimonial not found');
    await logAdminActivity({
      adminEmail,
      action: 'DELETE_TESTIMONIAL',
      entity: 'Testimonial',
      entityId: id,
      summary: `Deleted testimonial: ${t.clientName}`,
      req,
    });
    return true;
  },

  // Partners
  async getPartners() {
    try {
      await connectToDatabase();
      const list = await Partner.find({ isPublished: true }).sort({ order: 1 }).lean();
      return (list && list.length) ? list : fallbackPartners;
    } catch {
      return fallbackPartners;
    }
  },

  async getAllPartnersAdmin() {
    await connectToDatabase();
    return Partner.find({}).sort({ order: 1 }).lean();
  },

  async createPartner(data, adminEmail, req) {
    await connectToDatabase();
    const p = await Partner.create(data);
    await logAdminActivity({
      adminEmail,
      action: 'CREATE_PARTNER',
      entity: 'Partner',
      entityId: p._id,
      summary: `Added partner: ${p.name}`,
      req,
    });
    return p;
  },

  async updatePartner(id, data, adminEmail, req) {
    await connectToDatabase();
    const p = await Partner.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!p) throw new Error('Partner not found');
    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_PARTNER',
      entity: 'Partner',
      entityId: id,
      summary: `Updated partner: ${p.name}`,
      req,
    });
    return p;
  },

  async deletePartner(id, adminEmail, req) {
    await connectToDatabase();
    const p = await Partner.findByIdAndDelete(id);
    if (!p) throw new Error('Partner not found');
    await logAdminActivity({
      adminEmail,
      action: 'DELETE_PARTNER',
      entity: 'Partner',
      entityId: id,
      summary: `Deleted partner: ${p.name}`,
      req,
    });
    return true;
  },

  // Market & News
  async getMarketData() {
    try {
      await connectToDatabase();
      const [indices, newsItems] = await Promise.all([
        MarketIndex.find({}).sort({ symbol: 1 }).lean().catch(() => []),
        NewsItem.find({ isPublished: true }).sort({ order: 1, publishedAt: -1 }).lean().catch(() => []),
      ]);

      const activeIndices = (indices && indices.length) ? indices : fallbackMarketIndices;
      const activeNews = (newsItems && newsItems.length) ? newsItems : [];

      return {
        indices: activeIndices,
        news: {
          popular: activeNews.filter((n) => n.tab === 'popular'),
          ipo: activeNews.filter((n) => n.tab === 'ipo' || n.tab === 'recent'),
          market: activeNews.filter((n) => n.tab === 'market' || n.tab === 'trending'),
        },
        lastUpdated: new Date(),
      };
    } catch {
      return {
        indices: fallbackMarketIndices,
        news: {
          popular: [],
          ipo: [],
          market: [],
        },
        lastUpdated: new Date(),
      };
    }
  },

  async updateMarketNews(data, adminEmail, req) {
    await connectToDatabase();
    if (data.indices) {
      await MarketIndex.deleteMany({});
      await MarketIndex.insertMany(data.indices);
    }
    if (data.newsItems) {
      await NewsItem.deleteMany({});
      await NewsItem.insertMany(data.newsItems);
    }
    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_MARKET_NEWS',
      entity: 'MarketData',
      summary: `Updated market tickers and news articles.`,
      req,
    });
    return true;
  },
};

export default contentService;
