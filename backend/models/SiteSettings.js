import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'Finasset Wealth',
    },
    subTitle: {
      type: String,
      default: 'A Group of NLF Adhira Asset Services LLP, Bhubaneswar',
    },
    tagLine: {
      type: String,
      default: 'Empowering Your Financial Freedom with Disciplined Wealth Creation',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    faviconUrl: {
      type: String,
      default: '',
    },
    phone1: {
      type: String,
      default: '+91 94370 12345',
    },
    phone2: {
      type: String,
      default: '+91 674 2548900',
    },
    email1: {
      type: String,
      default: 'contact@finassetwealth.com',
    },
    email2: {
      type: String,
      default: 'support@adhiraassets.com',
    },
    address: {
      type: String,
      default: 'Plot No. 124, Saheed Nagar / Jaydev Vihar',
    },
    city: {
      type: String,
      default: 'Bhubaneswar',
    },
    state: {
      type: String,
      default: 'Odisha',
    },
    pincode: {
      type: String,
      default: '751007',
    },
    country: {
      type: String,
      default: 'India',
    },
    mapEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.53374944738!2d85.75042079999999!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com/company/finasset-wealth' },
      twitter: { type: String, default: 'https://twitter.com/finassetwealth' },
      facebook: { type: String, default: 'https://facebook.com/finassetwealth' },
      instagram: { type: String, default: 'https://instagram.com/finassetwealth' },
      youtube: { type: String, default: 'https://youtube.com/@finassetwealth' },
    },
    externalPortfolioUrl: {
      type: String,
      default: 'https://investor.finassetwealth.com/login',
    },
    externalBuyMfUrl: {
      type: String,
      default: 'https://invest.finassetwealth.com/quick-mf',
    },
    adminNotificationEmail: {
      type: String,
      default: 'admin@finassetwealth.com',
    },
    primaryColor: {
      type: String,
      default: '#10243A',
    },
    accentColor: {
      type: String,
      default: '#C7A76C',
    },
    copyrightText: {
      type: String,
      default: '© 2026 Finasset Wealth (NLF Adhira Asset Services LLP). All rights reserved.',
    },
    disclaimerText: {
      type: String,
      default: 'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns.',
    },
    amfiRegistrationNumber: {
      type: String,
      default: 'ARN-XXXXXX (AMFI Registered Mutual Fund Distributor)',
    },
    seoDefaults: {
      metaTitle: {
        type: String,
        default: 'Finasset Wealth | Financial Planning & Wealth Management Bhubaneswar',
      },
      metaDescription: {
        type: String,
        default: 'Finasset Wealth, a group of NLF Adhira Asset Services LLP Bhubaneswar, provides comprehensive financial planning, mutual funds, insurance, PMS, and wealth management services.',
      },
      keywords: {
        type: String,
        default: 'wealth management bhubaneswar, financial planning odisha, mutual fund distributor, nri investments, pms, insurance planning, finasset wealth',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
