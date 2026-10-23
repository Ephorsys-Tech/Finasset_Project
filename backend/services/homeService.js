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
import {
  fallbackHeroSlides,
  fallbackServices,
  fallbackInvestorTools,
  fallbackMarketIndices,
  fallbackNewsItems,
  fallbackTestimonials,
  fallbackFinancialVideo,
} from '@/lib/fallbackData';

export const homeService = {
  async getHomeData() {
    try {
      await connectToDatabase();

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
        HeroSlide.find({ isActive: true }).sort({ order: 1 }).lean().catch(() => []),
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
        heroSlides: (heroSlides && heroSlides.length) ? heroSlides : fallbackHeroSlides,
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
        heroSlides: fallbackHeroSlides,
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

  async updateHeroSlides(slides, adminEmail, req) {
    await connectToDatabase();
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
