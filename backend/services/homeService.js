import mongoose from 'mongoose';
import { connectToDatabase } from '@/backend/config/db';
import SiteSettings from '@/backend/models/SiteSettings';
import HeroSlide from '@/backend/models/HeroSlide';
import Service from '@/backend/models/Service';
import InvestorTool from '@/backend/models/InvestorTool';
import MarketIndex from '@/backend/models/MarketIndex';
import NewsItem from '@/backend/models/NewsItem';
import Testimonial from '@/backend/models/Testimonial';
import Partner from '@/backend/models/Partner';
import Video from '@/backend/models/Video';
import { logAdminActivity } from '@/backend/lib/auth';
import { cloudinary } from '@/backend/config/cloudinary';
import {
  fallbackServices,
  fallbackInvestorTools,
  fallbackMarketIndices,
  fallbackNewsItems,
  fallbackTestimonials,
  fallbackFinancialVideo,
} from '@/lib/fallbackData';

function isCloudinaryTransformSegment(segment) {
  if (!segment) return false;
  if (segment.includes(',')) return true;
  return (
    /^(?:[a-z]{1,3}_[a-zA-Z0-9_\-]+,?)+$/.test(segment) &&
    /^(?:c|w|h|q|f|e|b|r|a|co|bo|fl|pg|so|eo|du|dn)_/.test(segment)
  );
}

function getCloudinaryPublicId(url = '') {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    let pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
    if (pathAfterUpload.includes('/')) {
      const parts = pathAfterUpload.split('/');
      if (isCloudinaryTransformSegment(parts[0])) {
        parts.shift();
        pathAfterUpload = parts.join('/');
      }
    }
    const lastDotIndex = pathAfterUpload.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }
    return pathAfterUpload || null;
  } catch {
    return null;
  }
}

export const homeService = {
  getCloudinaryPublicId,
  async getHomeData(isAdmin = false) {
    try {
      await connectToDatabase();

      const heroQuery = isAdmin ? {} : { isActive: true };

      const [
        settings,
        heroSlides,
        services,
        investorTools,
        marketIndices,
        newsItems,
        testimonials,
        partners,
        videos,
      ] = await Promise.all([
        SiteSettings.findOne({}).lean().catch(() => null),
        HeroSlide.find(heroQuery).sort({ order: 1 }).lean().catch(() => []),
        Service.find({ isPublished: true }).sort({ displayOrder: 1 }).lean().catch(() => []),
        InvestorTool.find({ isVisible: true }).sort({ order: 1 }).lean().catch(() => []),
        MarketIndex.find({}).sort({ symbol: 1 }).lean().catch(() => []),
        NewsItem.find({ isPublished: true }).sort({ order: 1, publishedAt: -1 }).lean().catch(() => []),
        Testimonial.find({ isPublished: true }).sort({ order: 1 }).lean().catch(() => []),
        Partner.find({ isPublished: true }).sort({ order: 1 }).lean().catch(() => []),
        Video.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: -1 }).limit(4).lean().catch(() => []),
      ]);

      const rawNews = (newsItems && newsItems.length) ? newsItems : [];
      const normalizedNews = rawNews.map((item) => {
        const dateVal =
          item.date ||
          (item.publishedAt
            ? typeof item.publishedAt === 'string'
              ? item.publishedAt
              : new Date(item.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
            : '');

        return {
          ...item,
          description: item.description || item.summary || '',
          summary: item.summary || item.description || '',
          tag: item.tag || item.badge || 'Market Alert',
          badge: item.badge || item.tag || 'Market Alert',
          subTag: item.subTag || item.source || 'Advisory Desk',
          source: item.source || item.subTag || 'Advisory Desk',
          date: dateVal,
          readTime: item.readTime || '3 min Read',
          imageUrl: item.imageUrl || '',
        };
      });

      return {
        settings: settings || {},
        heroSlides: (heroSlides && heroSlides.length) ? heroSlides : [],
        services: (services && services.length) ? services : fallbackServices,
        investorTools: (investorTools && investorTools.length) ? investorTools : fallbackInvestorTools,
        marketIndices: (marketIndices && marketIndices.length) ? marketIndices : fallbackMarketIndices,
        newsItems: normalizedNews,
        testimonials: (testimonials && testimonials.length) ? testimonials : fallbackTestimonials,
        partners: (partners && partners.length) ? partners : [],
        financialVideos: (videos && videos.length) ? videos : (settings?.financialVideo ? [settings.financialVideo] : [fallbackFinancialVideo]),
        financialVideo: (videos && videos.length) ? videos[0] : (settings?.financialVideo || fallbackFinancialVideo),
      };
    } catch (err) {
      console.warn('⚠️ Serving cached fallback home data:', err.message);
      return {
        settings: {},
        heroSlides: [],
        services: fallbackServices,
        investorTools: fallbackInvestorTools,
        marketIndices: fallbackMarketIndices,
        newsItems: [],
        testimonials: fallbackTestimonials,
        partners: [],
        financialVideos: [fallbackFinancialVideo],
        financialVideo: fallbackFinancialVideo,
        isFallback: true,
      };
    }
  },

  /**
   * Create a single new hero slide
   */
  async createHeroSlide(data, adminEmail, req) {
    await connectToDatabase();

    const title = (data.title || '').trim();
    const subtitle = (data.subtitle || data.description || '').trim();
    if (!title) throw new Error('Hero slide title is required');
    if (!subtitle) throw new Error('Hero slide subtitle is required');

    const bgImageUrl = (data.bgImageUrl || data.imageUrl || '').trim();
    const publicId = (data.publicId || getCloudinaryPublicId(bgImageUrl) || '').trim();

    const count = await HeroSlide.countDocuments();
    const slide = await HeroSlide.create({
      title,
      subtitle,
      bgImageUrl,
      publicId,
      badge: data.badge || 'Finasset Wealth Management',
      cta1Text: 'Our Services',
      cta1Url: '#services',
      cta2Text: 'Contact Us',
      cta2Url: '#contact',
      statsHighlight: data.statsHighlight || { label: 'Client Trust', value: '15+ Years in Odisha' },
      order: typeof data.order === 'number' ? data.order : count + 1,
      isActive: data.isActive !== false,
    });

    await logAdminActivity({
      adminEmail,
      action: 'CREATE',
      entity: 'HeroSlide',
      entityId: slide._id.toString(),
      summary: `Created hero slide: "${slide.title}".`,
      req,
    });

    return slide;
  },

  /**
   * Update an existing hero slide by ID
   */
  async updateHeroSlide(id, data, adminEmail, req) {
    await connectToDatabase();

    let slide = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      slide = await HeroSlide.findById(id);
    }
    if (!slide) {
      slide = await HeroSlide.findOne({ order: Number(id) || -999 });
    }
    if (!slide) throw new Error('Hero slide not found');

    const updateFields = {};
    if (data.title !== undefined) updateFields.title = String(data.title).trim();
    if (data.subtitle !== undefined || data.description !== undefined) {
      updateFields.subtitle = String(data.subtitle || data.description).trim();
    }
    if (data.order !== undefined) updateFields.order = Number(data.order);
    if (data.isActive !== undefined) updateFields.isActive = Boolean(data.isActive);

    const newBgImageUrl = (data.bgImageUrl || data.imageUrl || '').trim();
    const newPublicId = (data.publicId || getCloudinaryPublicId(newBgImageUrl) || '').trim();

    if (newBgImageUrl) {
      updateFields.bgImageUrl = newBgImageUrl;
      updateFields.publicId = newPublicId;

      // If image changed and previous image was on Cloudinary, delete the old image
      const oldPublicId = slide.publicId || getCloudinaryPublicId(slide.bgImageUrl);
      if (oldPublicId && oldPublicId !== newPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (err) {
          console.warn('Failed to delete replaced Cloudinary image:', err.message);
        }
      }
    }

    const updated = await HeroSlide.findByIdAndUpdate(slide._id, { $set: updateFields }, { new: true });

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE',
      entity: 'HeroSlide',
      entityId: slide._id.toString(),
      summary: `Updated hero slide: "${updated.title}".`,
      req,
    });

    return updated;
  },

  /**
   * Delete a hero slide by ID
   * Also deletes the associated image from Cloudinary
   */
  async deleteHeroSlide(id, adminEmail, req) {
    await connectToDatabase();

    let slide = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      slide = await HeroSlide.findById(id);
    }
    if (!slide) {
      slide = await HeroSlide.findOne({ order: Number(id) || -999 });
    }
    if (!slide) throw new Error('Hero slide not found');

    // Delete image from Cloudinary if hosted there
    const publicId = slide.publicId || getCloudinaryPublicId(slide.bgImageUrl);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn('Failed to delete hero slide image from Cloudinary:', err.message);
      }
    }

    await HeroSlide.findByIdAndDelete(slide._id);

    await logAdminActivity({
      adminEmail,
      action: 'DELETE',
      entity: 'HeroSlide',
      entityId: slide._id.toString(),
      summary: `Deleted hero slide: "${slide.title}" and destroyed Cloudinary image.`,
      req,
    });

    return slide;
  },

  /**
   * Bulk update hero slides
   * Ensures removed slides have their Cloudinary images destroyed
   */
  async updateHeroSlides(slides, adminEmail, req) {
    await connectToDatabase();

    // Check existing slides to find any removed ones and destroy their Cloudinary images
    const existingSlides = await HeroSlide.find({}).lean();
    const incomingIds = new Set(
      slides.map((s) => (s._id || s.id)?.toString()).filter(Boolean)
    );

    for (const existing of existingSlides) {
      const existingId = existing._id?.toString();
      if (!incomingIds.has(existingId)) {
        const publicId = existing.publicId || getCloudinaryPublicId(existing.bgImageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn('Failed to delete removed slide Cloudinary image:', err.message);
          }
        }
      }
    }

    await HeroSlide.deleteMany({});
    const inserted = await HeroSlide.insertMany(slides);

    await logAdminActivity({
      adminEmail,
      action: 'UPDATE_HERO_SLIDES',
      entity: 'HeroSlide',
      summary: `Updated ${inserted.length} homepage hero slides.`,
      req,
    });

    return inserted;
  },
};

export default homeService;
