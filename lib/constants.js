/**
 * Finasset Wealth - Global Brand Constants & Configurations
 */

export const BRAND = {
  name: 'Finasset Wealth',
  entityName: 'NLF Adhira Asset Services LLP',
  tagline: 'Your Trusted Partner in Wealth Creation & Financial Freedom',
  description: 'Finasset Wealth is a premier wealth management and financial advisory firm based in Bhubaneswar, Odisha. We empower individuals and institutions with bespoke portfolio management, mutual funds, insurance, and retirement planning.',
  location: {
    address: 'Plot No. 124, Saheed Nagar, Janpath Road',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pinCode: '751007',
    country: 'India',
    fullAddress: 'Plot No. 124, Saheed Nagar, Janpath Road, Bhubaneswar, Odisha - 751007',
  },
  contact: {
    primaryPhone: '+91 94370 12345',
    secondaryPhone: '+91 674 2548900',
    primaryEmail: 'contact@finassetwealth.com',
    supportEmail: 'support@finassetwealth.com',
    workingHours: 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)',
  },
  social: {
    linkedin: 'https://linkedin.com/company/finasset-wealth',
    twitter: 'https://twitter.com/finassetwealth',
    facebook: 'https://facebook.com/finassetwealth',
    youtube: 'https://youtube.com/@finassetwealth',
  },
  regulatory: {
    amfiArn: 'ARN-189204',
    llpin: 'AAY-9021',
    disclaimer: 'Mutual Fund investments are subject to market risks, read all scheme related documents carefully.',
  },
};

export const ENQUIRY_TYPES = {
  CALLBACK: 'CALLBACK',
  CONTACT: 'CONTACT',
  SERVICE_CONSULTATION: 'SERVICE_CONSULTATION',
  RISK_ASSESSMENT: 'RISK_ASSESSMENT',
  CAREER: 'CAREER',
};

export const ENQUIRY_STATUSES = [
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-amber-100 text-amber-700' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-purple-100 text-purple-700' },
  { value: 'RESOLVED', label: 'Resolved', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'CLOSED', label: 'Closed', color: 'bg-gray-100 text-gray-700' },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Mutual Funds Advisory', href: '/services/mutual-funds' },
      { label: 'Portfolio Management (PMS)', href: '/services/portfolio-management' },
      { label: 'Retirement & Pension', href: '/services/retirement-planning' },
      { label: 'Tax Advisory & Planning', href: '/services/tax-planning' },
      { label: 'Comprehensive Insurance', href: '/services/insurance-planning' },
      { label: 'NRI Investment Desk', href: '/services/nri-investments' },
    ],
  },
  {
    label: 'Investor Corner',
    href: '/investor',
    children: [
      { label: 'SIP & Lumpsum Calculator', href: '/investor/financial-calculator' },
      { label: 'Risk Profile Assessment', href: '/investor/risk-profile' },
      { label: 'Financial Fitness Score', href: '/investor/financial-fitness' },
      { label: 'Pay Insurance Premium', href: '/investor/pay-premium' },
      { label: 'Invest Online (MF)', href: '/investor/buy-mf-online' },
    ],
  },
  { label: 'NRI Corner', href: '/nri-corner' },
  { label: 'Market Update', href: '/market-update' },
  { label: 'Taxation', href: '/taxation' },
  { label: 'Career', href: '/career' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
];

export const ADMIN_NAV = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    group: 'Client & Leads',
    items: [
      { label: 'Enquiries & Leads', href: '/admin/enquiries', icon: 'Inbox' },
    ],
  },
  {
    group: 'Website Content',
    items: [
      { label: 'Site Settings', href: '/admin/site-settings', icon: 'Settings' },
      { label: 'Navigation Menus', href: '/admin/menus', icon: 'Menu' },
      { label: 'Homepage Builder', href: '/admin/home-page', icon: 'LayoutTemplate' },
      { label: 'Services CMS', href: '/admin/services', icon: 'Briefcase' },
      { label: 'Investor Corner', href: '/admin/investor-corner', icon: 'PieChart' },
      { label: 'Pay Premium Links', href: '/admin/pay-premium', icon: 'CreditCard' },
      { label: 'Calculators & Tools', href: '/admin/calculators', icon: 'Calculator' },
      { label: 'Questionnaires', href: '/admin/questionnaires', icon: 'HelpCircle' },
      { label: 'Market & News', href: '/admin/news-market', icon: 'TrendingUp' },
      { label: 'Testimonials', href: '/admin/testimonials', icon: 'MessageSquare' },
      { label: 'Partners & Logos', href: '/admin/partners', icon: 'ShieldCheck' },
      { label: 'Custom Pages', href: '/admin/pages', icon: 'FileText' },
      { label: 'Blog & Insights', href: '/admin/blog', icon: 'BookOpen' },
    ],
  },
  {
    group: 'System & Security',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: 'Image' },
      { label: 'Activity Logs', href: '/admin/activity-log', icon: 'Clock' },
    ],
  },
];
