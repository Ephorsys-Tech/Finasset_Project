const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finasset_wealth';

async function seed() {
  console.log('🌱 Starting Finasset Wealth database seed...');
  console.log(`📡 Connecting to MongoDB: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err) {
    console.error('❌ Could not connect to MongoDB:', err.message);
    console.log('💡 Tip: Make sure your MongoDB Atlas connection string is configured in .env.local (MONGODB_URI)');
    process.exit(1);
  }

  const db = mongoose.connection.db;

  // 1. Seed Admin
  console.log('👤 Seeding default Administrator...');
  const AdminColl = db.collection('admins');
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@finassetwealth.com').toLowerCase();
  const existingAdmin = await AdminColl.findOne({ email: adminEmail });

  const hashedPassword = await bcrypt.hash(process.env.INITIAL_ADMIN_PASSWORD || 'Finasset@Admin2026!', 12);

  if (!existingAdmin) {
    await AdminColl.insertOne({
      email: adminEmail,
      password: hashedPassword,
      name: process.env.INITIAL_ADMIN_NAME || 'Finasset Chief Administrator',
      role: 'ADMIN',
      failedLogins: 0,
      lockoutUntil: null,
      lastLogin: null,
      lastActive: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${adminEmail}`);
  }

  // 2. Site Settings
  console.log('⚙️ Seeding Site Settings...');
  const SettingsColl = db.collection('sitesettings');
  const existingSettings = await SettingsColl.findOne({});
  const defaultSettings = {
    brandName: 'Finasset Wealth',
    subTitle: 'A Group of NLF Adhira Asset Services LLP, Bhubaneswar',
    tagLine: 'Empowering Your Financial Freedom with Disciplined Wealth Creation',
    logoUrl: '/images/finasset-logo.png',
    faviconUrl: '/favicon.ico',
    phone1: '+91 94370 12345',
    phone2: '+91 674 2548900',
    email1: 'contact@finassetwealth.com',
    email2: 'support@adhiraassets.com',
    address: 'Plot No. 124, Ground & 1st Floor, Saheed Nagar / Jaydev Vihar Corridor',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pincode: '751007',
    country: 'India',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.53374944738!2d85.75042079999999!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/finasset-wealth',
      twitter: 'https://twitter.com/finassetwealth',
      facebook: 'https://facebook.com/finassetwealth',
      instagram: 'https://instagram.com/finassetwealth',
      youtube: 'https://youtube.com/@finassetwealth',
    },
    externalPortfolioUrl: 'https://investor.finassetwealth.com/login',
    externalBuyMfUrl: 'https://invest.finassetwealth.com/quick-mf',
    adminNotificationEmail: 'admin@finassetwealth.com',
    primaryColor: '#10243A',
    accentColor: '#C7A76C',
    copyrightText: '© 2026 Finasset Wealth (A Group of NLF Adhira Asset Services LLP). All rights reserved.',
    disclaimerText: 'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns. Finasset Wealth acts as an AMFI-registered mutual fund distributor and wealth consultant.',
    amfiRegistrationNumber: 'ARN-189204 (AMFI Registered Mutual Fund Distributor)',
    seoDefaults: {
      metaTitle: 'Finasset Wealth | Financial Planning & Wealth Management Bhubaneswar',
      metaDescription: 'Finasset Wealth, a group of NLF Adhira Asset Services LLP Bhubaneswar, provides comprehensive financial planning, mutual funds, insurance, PMS, and wealth management services.',
      keywords: 'wealth management bhubaneswar, financial planning odisha, mutual fund distributor, nri investments, pms, insurance planning, finasset wealth',
    },
    updatedAt: new Date(),
  };

  if (!existingSettings) {
    await SettingsColl.insertOne({ ...defaultSettings, createdAt: new Date() });
    console.log('✅ Site Settings created.');
  } else {
    await SettingsColl.updateOne({}, { $set: defaultSettings });
    console.log('✅ Site Settings updated.');
  }

  // 3. Menus
  console.log('📋 Seeding Navigation Menus...');
  const MenuColl = db.collection('menus');
  await MenuColl.deleteMany({});
  await MenuColl.insertMany([
    {
      location: 'header',
      title: 'Primary Navigation',
      items: [
        { label: 'Home', url: '/', order: 0, isExternal: false, isVisible: true, children: [] },
        { label: 'About Us', url: '/about-us', order: 1, isExternal: false, isVisible: true, children: [] },
        {
          label: 'Services',
          url: '/services',
          order: 2,
          isExternal: false,
          isVisible: true,
          children: [
            { label: 'Financial Planning', url: '/services/financial-planning', order: 0, isExternal: false, isVisible: true },
            { label: 'Mutual Funds', url: '/services/mutual-funds', order: 1, isExternal: false, isVisible: true },
            { label: 'Insurance Planning', url: '/services/insurance', order: 2, isExternal: false, isVisible: true },
            { label: 'Real Estate Advisory', url: '/services/real-estate', order: 3, isExternal: false, isVisible: true },
            { label: 'FD & Bonds', url: '/services/fixed-deposits-bonds', order: 4, isExternal: false, isVisible: true },
            { label: 'Portfolio Management (PMS)', url: '/services/portfolio-management-service', order: 5, isExternal: false, isVisible: true },
          ],
        },
        {
          label: "Investor's Corner",
          url: '/investor/financial-calculator',
          order: 3,
          isExternal: false,
          isVisible: true,
          children: [
            { label: 'Financial Calculator', url: '/investor/financial-calculator', order: 0, isExternal: false, isVisible: true },
            { label: 'Know Your Risk Profile', url: '/investor/risk-profile', order: 1, isExternal: false, isVisible: true },
            { label: 'Check Financial Fitness', url: '/investor/financial-fitness', order: 2, isExternal: false, isVisible: true },
            { label: 'Pay Premium Online', url: '/investor/pay-premium', order: 3, isExternal: false, isVisible: true },
            { label: 'Buy MF Online', url: '/investor/buy-mf-online', order: 4, isExternal: false, isVisible: true },
          ],
        },
        { label: 'NRI Corner', url: '/nri-corner', order: 4, isExternal: false, isVisible: true, children: [] },
        { label: 'Taxation', url: '/taxation', order: 5, isExternal: false, isVisible: true, children: [] },
        { label: 'Market Update', url: '/market-update', order: 6, isExternal: false, isVisible: true, children: [] },
        { label: 'Blog', url: '/blog', order: 7, isExternal: false, isVisible: true, children: [] },
        { label: 'Contact Us', url: '/contact-us', order: 8, isExternal: false, isVisible: true, children: [] },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      location: 'footer',
      title: 'Footer Navigation',
      items: [
        { label: 'About Finasset', url: '/about-us', order: 0, isExternal: false, isVisible: true, children: [] },
        { label: 'Our Services', url: '/services', order: 1, isExternal: false, isVisible: true, children: [] },
        { label: 'Financial Calculator', url: '/investor/financial-calculator', order: 2, isExternal: false, isVisible: true, children: [] },
        { label: 'Risk Profiler', url: '/investor/risk-profile', order: 3, isExternal: false, isVisible: true, children: [] },
        { label: 'NRI Advisory', url: '/nri-corner', order: 4, isExternal: false, isVisible: true, children: [] },
        { label: 'Taxation Planning', url: '/taxation', order: 5, isExternal: false, isVisible: true, children: [] },
        { label: 'Careers', url: '/career', order: 6, isExternal: false, isVisible: true, children: [] },
        { label: 'Portfolio Login', url: '/portfolio-login', order: 7, isExternal: false, isVisible: true, children: [] },
        { label: 'Privacy Policy', url: '/privacy-policy', order: 8, isExternal: false, isVisible: true, children: [] },
        { label: 'Terms of Service', url: '/terms-of-service', order: 9, isExternal: false, isVisible: true, children: [] },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Navigation menus seeded.');

  // 4. Hero Slides
  console.log('🖼️ Seeding Hero Slides...');
  const SlideColl = db.collection('heroslides');
  await SlideColl.deleteMany({});
  await SlideColl.insertMany([
    {
      title: 'Architecting Generational Wealth for Discerning Families',
      subtitle: 'Personalized wealth management, structured portfolio strategies, and bespoke financial solutions guided by seasoned advisors in Bhubaneswar.',
      badge: 'Bhubaneswar Premier Wealth Advisory',
      cta1Text: 'Explore Our Services',
      cta1Url: '/services',
      cta2Text: 'Calculate Your Wealth',
      cta2Url: '/investor/financial-calculator',
      bgImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      statsHighlight: { label: 'Client Trust & Assets', value: '15+ Years in Odisha' },
      order: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Disciplined Mutual Fund & SIP Portfolios Built for Growth',
      subtitle: 'Harness the unstoppable power of rupee compounding with scientifically curated, risk-adjusted mutual fund portfolios across leading AMCs.',
      badge: 'AMFI Registered Distributor',
      cta1Text: 'Start SIP Journey',
      cta1Url: '/services/mutual-funds',
      cta2Text: 'Know Your Risk Profile',
      cta2Url: '/investor/risk-profile',
      bgImageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
      statsHighlight: { label: 'Mutual Fund Partners', value: '35+ Leading AMCs' },
      order: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Fortify Your Family Future with Strategic Insurance Planning',
      subtitle: 'Comprehensive life, health, and term insurance advisory crafted to safeguard your family’s dreams against life’s unpredictable events.',
      badge: 'Comprehensive Risk Cover',
      cta1Text: 'Explore Insurance Plans',
      cta1Url: '/services/insurance',
      cta2Text: 'Pay Premium Online',
      cta2Url: '/investor/pay-premium',
      bgImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=2070&auto=format&fit=crop',
      statsHighlight: { label: 'Protection Provided', value: '100% Honest Guidance' },
      order: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Specialized NRI Wealth Advisory & Repatriation Assistance',
      subtitle: 'Seamless, compliant investment avenues in India for Non-Resident Indians. Master FEMA rules, NRE/NRO taxation, and high-yield asset classes.',
      badge: 'Global NRI Corner',
      cta1Text: 'NRI Advisory Services',
      cta1Url: '/nri-corner',
      cta2Text: 'Consult Our Experts',
      cta2Url: '/contact-us',
      bgImageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop',
      statsHighlight: { label: 'Global Clients', value: '12+ Countries Served' },
      order: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Hero slides seeded.');

  // 5. Core Services
  console.log('💼 Seeding Core Services...');
  const ServiceColl = db.collection('services');
  await ServiceColl.deleteMany({});
  await ServiceColl.insertMany([
    {
      name: 'Financial Planning',
      slug: 'financial-planning',
      shortDescription: 'Holistic blueprint to align your current income, expenses, and aspirations into an achievable, resilient financial roadmap.',
      fullDescription: 'At Finasset Wealth, financial planning is not merely about picking high-return instruments; it is an all-encompassing, disciplined process. We evaluate your current net worth, analyze your cash flows, identify potential financial vulnerabilities, and construct an actionable life-stage plan tailored for retirement, children’s higher education, marriage, and wealth preservation.',
      iconName: 'Compass',
      bannerImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop',
      keyBenefits: [
        { title: 'Goal-Based Roadmapping', description: 'Clear milestones for retirement, home acquisition, and children’s education.' },
        { title: 'Cashflow & Debt Optimization', description: 'Streamline high-cost debt and enhance monthly investible surplus.' },
        { title: 'Contingency & Emergency Reserves', description: 'Structured emergency funds to weather market downturns or personal events.' },
        { title: 'Periodic Portfolio Reviews', description: 'Bi-annual portfolio rebalancing to maintain optimal asset allocation.' },
      ],
      contentSections: [
        {
          title: 'The Finasset Financial Planning Framework',
          content: 'We adhere to a globally recognized 6-step financial planning methodology: gathering qualitative and quantitative data, establishing clear quantifiable goals, diagnosing current financial standing, formulating personalized investment recommendations, executing seamlessly, and continuously monitoring progress.',
          order: 0,
        },
        {
          title: 'Retirement Freedom Architecture',
          content: 'Retirement is not an age; it is a financial number. We calculate your exact post-retirement monthly corpus requirement factoring in medical inflation, lifestyle expectations, and longevity risks, ensuring your wealth outlives you.',
          order: 1,
        },
        {
          title: 'Estate and Succession Clarity',
          content: 'Ensure your hard-earned assets transition seamlessly to your rightful heirs without legal bottlenecks, probate delays, or family discord through structured wills and nomination audits.',
          order: 2,
        },
      ],
      faqs: [
        { question: 'Why do I need a financial plan if I am already investing in Mutual Funds?', answer: 'Investing without a financial plan is like setting sail without a compass. A financial plan ensures your investments match your time horizon, risk capacity, and real-life goals, preventing hasty premature redemptions during market corrections.' },
        { question: 'How often should my financial plan be updated?', answer: 'We recommend a comprehensive review at least once a year, or immediately whenever significant life transitions occur (such as marriage, childbirth, career change, or inheritance).' },
        { question: 'Do you provide fiduciary and unbiased guidance?', answer: 'Yes. As wealth partners under NLF Adhira Asset Services LLP, our guidance prioritizes client suitability, ethical standards, and regulatory transparency.' },
      ],
      displayOrder: 0,
      isPublished: true,
      metaTitle: 'Financial Planning Services in Bhubaneswar | Finasset Wealth',
      metaDescription: 'Custom financial planning, retirement planning, and goal-oriented investment blueprints by certified wealth consultants at Finasset Wealth, Bhubaneswar.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Mutual Funds',
      slug: 'mutual-funds',
      shortDescription: 'Curated equity, debt, hybrid, and thematic mutual fund portfolios designed for superior risk-adjusted wealth accumulation.',
      fullDescription: 'Mutual funds are the engine of India’s economic growth story. With over 2,500 schemes available in the Indian market, scheme selection is critical. Finasset Wealth leverages quantitative fund-manager tracking, rolling-return analysis, and risk-adjusted metrics (Sharpe, Treynor, Standard Deviation) to handpick high-conviction funds across Large Cap, Flexi Cap, Mid Cap, Small Cap, and Hybrid categories.',
      iconName: 'TrendingUp',
      bannerImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
      keyBenefits: [
        { title: 'Scientific Fund Selection', description: 'Screening beyond past 1-year returns to evaluate downside protection and consistency.' },
        { title: 'Disciplined SIP Automation', description: 'Automated monthly investments allowing you to benefit from Rupee Cost Averaging.' },
        { title: 'Tax-Harvesting Strategies', description: 'Timely rebalancing to optimize Long-Term Capital Gains (LTCG) tax benefits.' },
        { title: 'Multi-AMC Unified Tracking', description: 'Consolidated portfolio dashboard to view all investments in one single window.' },
      ],
      contentSections: [
        {
          title: 'Systematic Investment Plans (SIP) — The Compounding Miracle',
          content: 'SIP removes market timing anxiety. By investing a fixed sum every month regardless of market sentiment, you accumulate more units when markets are down and fewer when markets are up. Over 10 to 20 years, this disciplined consistency creates phenomenal wealth.',
          order: 0,
        },
        {
          title: 'Asset Allocation — The True Driver of Portfolio Returns',
          content: 'Studies prove that over 90% of portfolio performance variation is determined by asset allocation (equity vs. debt vs. gold), not individual stock picking. We construct balanced asset mixes that shield capital during bear phases while capturing explosive bull rallies.',
          order: 1,
        },
      ],
      faqs: [
        { question: 'What is the minimum amount required to start a SIP?', answer: 'You can begin a Systematic Investment Plan with as little as ₹500 to ₹1,000 per month in top-tier diversified equity funds.' },
        { question: 'Can I pause or increase my SIP amount later?', answer: 'Yes, SIPs are 100% flexible. You can increase, pause, modify, or stop your SIP installments without any financial penalties.' },
        { question: 'How are capital gains taxed in Mutual Funds?', answer: 'For equity mutual funds held for more than 12 months, long-term capital gains over ₹1.25 Lakh per financial year are taxed at 12.5%. Short-term gains (under 12 months) are taxed at 20%.' },
      ],
      displayOrder: 1,
      isPublished: true,
      metaTitle: 'Mutual Fund Investment & SIP Advisory Bhubaneswar | Finasset Wealth',
      metaDescription: 'Expert mutual fund distribution, portfolio rebalancing, and SIP advisory in Bhubaneswar. Partnered with 35+ top Indian AMCs.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Insurance Planning',
      slug: 'insurance',
      shortDescription: 'Robust risk mitigation strategies through Pure Term Insurance, Comprehensive Health Cover, and Critical Illness protection.',
      fullDescription: 'Wealth creation without risk protection is an incomplete strategy. A single medical emergency or premature loss of the breadwinner can completely dismantle years of disciplined savings. Finasset Wealth provides unbiased life and health insurance analysis, helping you compute Human Life Value (HLV) and select optimal indemnity covers with high claim-settlement ratios.',
      iconName: 'ShieldCheck',
      bannerImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=2070&auto=format&fit=crop',
      keyBenefits: [
        { title: 'Human Life Value (HLV) Calculation', description: 'Accurate term cover estimation to replace future income and clear outstanding liabilities.' },
        { title: 'Zero-Deductible Health Coverage', description: 'Super top-up and comprehensive family floater health covers to beat medical inflation.' },
        { title: 'Dedicated Claim Assistance', description: 'On-ground claims support in Bhubaneswar and nationwide hospital networks.' },
        { title: 'High Claim Settlement Track Record', description: 'We only partner with insurers maintaining >98% audited claim settlement ratios.' },
      ],
      contentSections: [
        {
          title: 'Why Term Insurance is Non-Negotiable',
          content: 'Unlike traditional endowment or money-back policies that yield sub-inflation returns, Pure Term Insurance provides massive financial protection at nominal annual premiums. We recommend term coverage equal to 15-20 times your annual income plus all existing liabilities.',
          order: 0,
        },
        {
          title: 'Shielding Wealth with Comprehensive Health Insurance',
          content: 'With healthcare inflation surging at 12-14% annually in India, a basic corporate health policy is insufficient. We design multi-tiered family floater plans with critical illness riders, restoration benefits, and zero room-rent sub-limits.',
          order: 1,
        },
      ],
      faqs: [
        { question: 'How much term insurance cover do I actually need?', answer: 'A reliable rule of thumb is 15 to 20 times your annual take-home income, plus the total value of any outstanding mortgages or loans.' },
        { question: 'What is the difference between Term Insurance and Traditional Insurance?', answer: 'Term insurance is pure risk cover with zero survival benefit, providing immense financial protection for very low premium. Traditional plans mix insurance with low-yield investments, yielding sub-optimal protection.' },
      ],
      displayOrder: 2,
      isPublished: true,
      metaTitle: 'Life & Health Insurance Advisory Bhubaneswar | Finasset Wealth',
      metaDescription: 'Safeguard your family with term insurance, family floater health policies, and critical illness plans. Claim assistance in Bhubaneswar.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Real Estate Advisory',
      slug: 'real-estate',
      shortDescription: 'Strategic property investment guidance, commercial asset evaluation, and high-yield real estate portfolio structuring in Odisha and beyond.',
      fullDescription: 'Real estate remains one of India’s most favored tangible assets. However, legal encumbrances, illiquidity, and regulatory complexities often pose significant risks. Finasset Wealth offers research-backed real estate advisory in Bhubaneswar and prime corridors, assisting with RERA compliance verification, commercial rental yield analysis, and fractional real estate opportunities.',
      iconName: 'Building',
      bannerImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop',
      keyBenefits: [
        { title: 'RERA & Legal Due Diligence', description: 'Rigorous title deed, land zoning, and developer track record verification.' },
        { title: 'High-Yield Commercial Opportunities', description: 'Focus on commercial properties offering 7-9% steady rental yields.' },
        { title: 'Capital Gains Tax Shielding (54F / 54EC)', description: 'Strategic reinvestment plans to save taxes on property sales.' },
        { title: 'Bhubaneswar Growth Corridor Insights', description: 'Early-stage insights into Info Valley, Patia, Khandagiri, and NH corridors.' },
      ],
      contentSections: [
        {
          title: 'Tangible Wealth with Uncompromising Diligence',
          content: 'Our real estate advisory desk separates emotional purchases from calculated investments. We evaluate land appreciation rates, infrastructure connectivity, water table availability, and civic approvals to protect your hard-earned capital.',
          order: 0,
        },
      ],
      faqs: [
        { question: 'Do you help with saving tax on real estate sales?', answer: 'Yes. We guide clients through Section 54, Section 54F, and Section 54EC Capital Gain Bonds to legally minimize tax liabilities arising from property sales.' },
      ],
      displayOrder: 3,
      isPublished: true,
      metaTitle: 'Real Estate Advisory & Property Investment Bhubaneswar | Finasset Wealth',
      metaDescription: 'RERA-compliant commercial and residential property advisory in Bhubaneswar, Odisha. Rental yield maximization and capital gains planning.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Fixed Deposits and Bonds',
      slug: 'fixed-deposits-bonds',
      shortDescription: 'Capital preservation solutions through AAA-rated corporate FDs, sovereign gold bonds (SGB), and high-yielding government debt papers.',
      fullDescription: 'For conservative investors and retirees seeking predictable monthly or quarterly cash flows, capital safety is paramount. We provide access to CRISIL/ICRA AAA and AA+ rated corporate fixed deposits, RBI floating rate savings bonds, capital gains bonds (54EC), and secondary market bonds offering attractive risk-adjusted spreads over standard bank deposits.',
      iconName: 'Landmark',
      bannerImage: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?q=80&w=2070&auto=format&fit=crop',
      keyBenefits: [
        { title: 'Enhanced Interest Spreads', description: 'Earn up to 100-150 bps higher returns compared to traditional public sector bank FDs.' },
        { title: 'Senior Citizen Privileges', description: 'Special preferential rates (0.25% to 0.50% extra) for elderly clients.' },
        { title: 'Flexible Payout Options', description: 'Monthly, quarterly, half-yearly, or cumulative interest payouts tailored to lifestyle.' },
        { title: 'Sovereign Capital Safety', description: 'Access to government-backed securities and RBI savings bonds.' },
      ],
      contentSections: [
        {
          title: 'Fixed Income in an Evolving Interest Rate Cycle',
          content: 'Interest rates fluctuate with RBI monetary policy. We help investors lock in peak yields during high-rate regimes and ladder their deposit maturities so liquidity is readily available when attractive reinvestment opportunities emerge.',
          order: 0,
        },
      ],
      faqs: [
        { question: 'Are corporate fixed deposits safe?', answer: 'We exclusively recommend corporate FDs from institutions backed by AAA or AA+ ratings from agencies like CRISIL, ICRA, and CARE, representing high degree of safety regarding timely servicing of financial obligations.' },
      ],
      displayOrder: 4,
      isPublished: true,
      metaTitle: 'Fixed Deposits & Bonds Advisory Bhubaneswar | Finasset Wealth',
      metaDescription: 'Secure high-interest AAA-rated corporate FDs, RBI bonds, and 54EC capital gains bonds with customized monthly payout options.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Portfolio Management Service (PMS)',
      slug: 'portfolio-management-service',
      shortDescription: 'Tailored discretionary and non-discretionary equity portfolios for High Net-Worth Individuals (HNIs) seeking alpha generation.',
      fullDescription: 'Portfolio Management Service (PMS) is a customized investment avenue for discerning investors with investible surplus of ₹50 Lakhs and above. Unlike mutual funds where all investors share a pooled NAV, PMS accounts hold direct shares in your individual Demat account, managed actively by India’s most celebrated fund managers to deliver aggressive benchmark-beating returns.',
      iconName: 'PieChart',
      bannerImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop',
      keyBenefits: [
        { title: 'Direct Equity Ownership', description: 'Shares are credited directly to your personal Demat account in your name.' },
        { title: 'Concentrated High-Conviction Bets', description: 'Portfolios of 15 to 25 hand-picked market leaders, unconstrained by index weights.' },
        { title: 'Fund Manager Access & Insights', description: 'Direct interactions and quarterly performance webinars with lead fund managers.' },
        { title: 'Transparent Fee Structures', description: 'Clear fixed and performance-linked fee models aligned with your portfolio gains.' },
      ],
      contentSections: [
        {
          title: 'Why Choose PMS Over Traditional Mutual Funds?',
          content: 'While mutual funds are ideal for retail investors, HNIs often require specialized sector-focused, multi-cap, or unlisted growth strategies. PMS allows dynamic cash calls during market euphoria, aggressive tactical rebalancing, and tax-loss harvesting.',
          order: 0,
        },
      ],
      faqs: [
        { question: 'What is the minimum statutory ticket size for PMS in India?', answer: 'As mandated by SEBI guidelines, the minimum investment ticket size for entering a Portfolio Management Service in India is ₹50 Lakhs.' },
      ],
      displayOrder: 5,
      isPublished: true,
      metaTitle: 'Portfolio Management Services (PMS) Bhubaneswar | Finasset Wealth',
      metaDescription: 'Bespoke PMS investment strategies for HNIs in Odisha. Direct Demat holdings, high-conviction equity portfolios, and leading fund managers.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Core services seeded.');

  // 6. Investor Tools
  console.log('🧮 Seeding Investor Tools...');
  const ToolColl = db.collection('investortools');
  await ToolColl.deleteMany({});
  await ToolColl.insertMany([
    {
      key: 'calculator',
      title: 'Financial Calculator',
      badge: 'Interactive SIP & Lumpsum Tool',
      shortDescription: 'Visualize the exponential power of compounding. Calculate future wealth, required monthly SIP, and lump sum returns with interactive sliders.',
      actionText: 'Launch Calculator',
      url: '/investor/financial-calculator',
      iconName: 'Calculator',
      accentColor: '#C7A76C',
      order: 0,
      isVisible: true,
      calculatorDefaults: {
        defaultSipAmount: 10000,
        defaultTenureYears: 15,
        defaultExpectedReturn: 12.5,
        defaultLumpsumAmount: 500000,
        disclaimer: 'Calculations are based on assumed rates of return compounded periodically and are for illustrative purposes only. They do not constitute guaranteed returns.',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      key: 'risk-profile',
      title: 'Know Your Risk Profile',
      badge: 'Psychometric Investor Assessment',
      shortDescription: 'Discover your true risk tolerance through our scientific questionnaire. Uncover whether you are Conservative, Moderate, or Aggressive.',
      actionText: 'Take Assessment',
      url: '/investor/risk-profile',
      iconName: 'Target',
      accentColor: '#10243A',
      order: 1,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      key: 'financial-fitness',
      title: 'Check Your Financial Fitness',
      badge: '360° Financial Health Checkup',
      shortDescription: 'Evaluate your financial vitality across emergency readiness, debt-to-income ratio, savings rate, and insurance sufficiency in 3 minutes.',
      actionText: 'Test Fitness Score',
      url: '/investor/financial-fitness',
      iconName: 'Activity',
      accentColor: '#C7A76C',
      order: 2,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      key: 'pay-premium',
      title: 'Pay Premium Online',
      badge: 'Direct Insurer Payment Links',
      shortDescription: 'Convenient one-click gateway to pay your renewal premiums directly on official insurer portals including LIC, HDFC Life, ICICI Pru, and Star Health.',
      actionText: 'Pay Insurance Premium',
      url: '/investor/pay-premium',
      iconName: 'CreditCard',
      accentColor: '#10243A',
      order: 3,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      key: 'buy-mf-online',
      title: 'Buy MF Online',
      badge: 'Seamless Mutual Fund Transacting',
      shortDescription: 'Direct digital platform connection to start fresh SIPs, switch schemes, or invest lumpsum in top Indian Mutual Funds with zero paperwork.',
      actionText: 'Transact Online',
      url: '/investor/buy-mf-online',
      iconName: 'Zap',
      accentColor: '#C7A76C',
      order: 4,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Investor tools seeded.');

  // 7. Questionnaires (Risk Profile & Financial Fitness)
  console.log('📝 Seeding Questionnaires...');
  const QColl = db.collection('questionnaires');
  await QColl.deleteMany({});
  await QColl.insertMany([
    {
      code: 'risk-profile',
      title: 'Know Your Risk Profile',
      description: 'Answer these 5 essential questions to determine your psychological risk appetite and financial capacity for market volatility.',
      questions: [
        {
          id: 1,
          title: 'What is your primary investment time horizon for this capital?',
          category: 'Time Horizon',
          options: [
            { text: 'Less than 1 year (Immediate liquidity needed)', score: 1, description: 'Capital safety is paramount.' },
            { text: '1 to 3 years (Short to medium term)', score: 2, description: 'Low to moderate volatility tolerable.' },
            { text: '3 to 7 years (Medium to long term)', score: 3, description: 'Can absorb periodic market cycles.' },
            { text: 'More than 7 years (Long term compounding)', score: 4, description: 'Ideal for aggressive equity compounding.' },
          ],
        },
        {
          id: 2,
          title: 'If your portfolio drops by 20% in a sudden market crash, what would you do?',
          category: 'Emotional Tolerance',
          options: [
            { text: 'Panic and sell all investments immediately to avoid further losses', score: 1, description: 'Very low risk tolerance.' },
            { text: 'Feel anxious and shift money into safer fixed deposits', score: 2, description: 'Moderate-conservative outlook.' },
            { text: 'Stay patient, do nothing, and wait for markets to recover', score: 3, description: 'Balanced long-term discipline.' },
            { text: 'View it as a massive discount opportunity and invest more capital', score: 4, description: 'Aggressive growth mindset.' },
          ],
        },
        {
          id: 3,
          title: 'What is your current source of income and financial stability?',
          category: 'Income Security',
          options: [
            { text: 'Retired with fixed pension or relying entirely on interest income', score: 1, description: 'Need guaranteed cashflows.' },
            { text: 'Variable income / seasonal business earnings', score: 2, description: 'Buffer needed for lean months.' },
            { text: 'Stable corporate salary or established professional practice', score: 3, description: 'Consistent monthly surplus.' },
            { text: 'High net worth with multiple diversified streams of passive income', score: 4, description: 'Very high financial resilience.' },
          ],
        },
        {
          id: 4,
          title: 'Which statement best describes your primary investment objective?',
          category: 'Objective',
          options: [
            { text: '100% Capital preservation. Even small nominal loss is unacceptable.', score: 1, description: 'Capital safety over returns.' },
            { text: 'Generate regular income with modest growth beating inflation slightly.', score: 2, description: 'Income oriented.' },
            { text: 'Balanced growth of wealth over time with moderate fluctuations.', score: 3, description: 'Growth with balance.' },
            { text: 'Aggressive wealth maximization to multiply capital over a decade.', score: 4, description: 'Maximum capital appreciation.' },
          ],
        },
        {
          id: 5,
          title: 'What is your level of prior experience with equity and market instruments?',
          category: 'Experience',
          options: [
            { text: 'None. I have only ever invested in Bank FDs, Post Office, or Gold.', score: 1, description: 'Beginner.' },
            { text: 'Basic. I have a few mutual fund SIPs but do not follow markets closely.', score: 2, description: 'Intermediate.' },
            { text: 'Moderate. I have invested across equity funds and understand market cycles.', score: 3, description: 'Knowledgeable.' },
            { text: 'Extensive. I actively analyze equities, derivatives, or direct shares.', score: 4, description: 'Advanced.' },
          ],
        },
      ],
      resultBands: [
        {
          minScore: 5,
          maxScore: 8,
          title: 'Conservative Investor',
          category: 'Capital Preservation',
          description: 'You prioritize capital security above all else. Market fluctuations cause distress, and your focus should be on capital stability and liquidity.',
          recommendation: 'Allocate predominantly to AAA-rated corporate fixed deposits, short-duration debt funds, arbitrage funds, and sovereign gold bonds.',
          assetAllocation: { equity: 15, debt: 75, goldRealEstate: 10 },
          badgeColor: '#10243A',
        },
        {
          minScore: 9,
          maxScore: 12,
          title: 'Moderately Conservative Investor',
          category: 'Cautious Growth',
          description: 'You seek modest capital appreciation while keeping the majority of your wealth protected from severe downturns.',
          recommendation: 'Multi-asset allocation funds, conservative hybrid mutual funds, and balanced advantage funds that dynamically adjust equity exposure.',
          assetAllocation: { equity: 35, debt: 55, goldRealEstate: 10 },
          badgeColor: '#1b3858',
        },
        {
          minScore: 13,
          maxScore: 16,
          title: 'Moderate Growth Investor',
          category: 'Balanced Wealth Creation',
          description: 'You understand that market volatility is the price of admission for long-term inflation-beating returns. You have a healthy investment horizon.',
          recommendation: 'A well-rounded portfolio of Large & Mid Cap equity funds, Flexi Cap funds, with 30-35% allocation to high-quality debt instruments.',
          assetAllocation: { equity: 65, debt: 25, goldRealEstate: 10 },
          badgeColor: '#C7A76C',
        },
        {
          minScore: 17,
          maxScore: 20,
          title: 'Aggressive Wealth Accumulator',
          category: 'High Alpha Growth',
          description: 'You have a long time horizon and high emotional resilience. You view market drawdowns as buying opportunities.',
          recommendation: 'High-conviction equity portfolios across Mid Cap, Small Cap, and focused equity funds, combined with specialized PMS strategies.',
          assetAllocation: { equity: 85, debt: 10, goldRealEstate: 5 },
          badgeColor: '#a88547',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'financial-fitness',
      title: 'Check Your Financial Fitness',
      description: 'Take this holistic 5-point financial wellness checkup to uncover your readiness across emergency buffers, savings, and protection.',
      questions: [
        {
          id: 1,
          title: 'Do you have a dedicated emergency fund covering 6 months of living expenses?',
          category: 'Emergency Readiness',
          options: [
            { text: 'No emergency fund at all. I would need to borrow money.', score: 1, description: 'Critical vulnerability.' },
            { text: 'I have 1 to 2 months of expenses in a savings account.', score: 2, description: 'Insufficient buffer.' },
            { text: 'I have 3 to 5 months kept in liquid instruments.', score: 3, description: 'Decent buffer.' },
            { text: 'Yes, 6 to 12 months fully funded in liquid funds or sweep-in FDs.', score: 4, description: 'Excellent emergency security.' },
          ],
        },
        {
          id: 2,
          title: 'What percentage of your monthly take-home income do you consistently save and invest?',
          category: 'Savings Rate',
          options: [
            { text: 'Less than 10% (Live paycheck to paycheck)', score: 1, description: 'High financial stress.' },
            { text: 'Between 10% and 20%', score: 2, description: 'Moderate savings.' },
            { text: 'Between 20% and 40%', score: 3, description: 'Healthy wealth-building rate.' },
            { text: 'Over 40% of income is systematically invested every month', score: 4, description: 'Champion savings rate.' },
          ],
        },
        {
          id: 3,
          title: 'What proportion of your monthly income goes toward debt servicing (EMIs and credit cards)?',
          category: 'Debt Ratio',
          options: [
            { text: 'More than 50% of income goes toward EMIs and credit card dues', score: 1, description: 'Debt trap risk.' },
            { text: 'Between 35% and 50%', score: 2, description: 'Elevated debt load.' },
            { text: 'Between 15% and 35%', score: 3, description: 'Manageable debt.' },
            { text: 'Zero debt or less than 15% (Home loan only)', score: 4, description: 'Superb debt freedom.' },
          ],
        },
        {
          id: 4,
          title: 'Do you have adequate Pure Term Insurance and Family Health Cover?',
          category: 'Risk Shield',
          options: [
            { text: 'No personal insurance. Rely only on employer cover or none.', score: 1, description: 'High risk exposure.' },
            { text: 'Have small traditional endowment policies with minimal cover.', score: 2, description: 'Sub-optimal protection.' },
            { text: 'Have term insurance but cover is less than 10x annual income.', score: 3, description: 'Partial protection.' },
            { text: 'Full 15-20x Term cover plus ₹25L+ Family Floater Health insurance.', score: 4, description: 'Fully fortified.' },
          ],
        },
        {
          id: 5,
          title: 'Do you have written, time-bound financial goals for retirement and milestones?',
          category: 'Goal Clarity',
          options: [
            { text: 'No documented goals. I invest randomly when extra cash is left.', score: 1, description: 'Ad-hoc investing.' },
            { text: 'I have mental ideas but no calculated numbers or target dates.', score: 2, description: 'Vague aspirations.' },
            { text: 'I have calculated my retirement corpus and kids education targets.', score: 3, description: 'Good goal structure.' },
            { text: 'Every SIP and investment is mapped to a specific goal with regular tracking.', score: 4, description: 'Mastery in financial planning.' },
          ],
        },
      ],
      resultBands: [
        {
          minScore: 5,
          maxScore: 8,
          title: 'Financial Fitness: Needs Immediate Attention',
          category: 'High Vulnerability',
          description: 'Your financial foundation has critical blind spots. Immediate focus is needed on setting up an emergency fund, trimming high-cost debt, and securing essential term insurance.',
          recommendation: 'Book a 1-on-1 financial diagnostic with Finasset Wealth advisors to construct a debt-reduction and liquidity blueprint.',
          assetAllocation: { equity: 20, debt: 70, goldRealEstate: 10 },
          badgeColor: '#e53e3e',
        },
        {
          minScore: 9,
          maxScore: 12,
          title: 'Financial Fitness: Fair Progress',
          category: 'Developing Health',
          description: 'You have started your financial journey, but your safety net and savings rate need reinforcement to achieve true financial independence.',
          recommendation: 'Boost monthly savings by 10%, augment your health insurance coverage, and map investments to quantifiable life milestones.',
          assetAllocation: { equity: 50, debt: 40, goldRealEstate: 10 },
          badgeColor: '#dd6b20',
        },
        {
          minScore: 13,
          maxScore: 16,
          title: 'Financial Fitness: Healthy & Resilient',
          category: 'Strong Foundation',
          description: 'You maintain commendable discipline. You have good emergency liquidity, controlled debt, and consistent investment habits.',
          recommendation: 'Optimize your portfolio for tax efficiency (LTCG harvesting) and consider diversifying into PMS or multi-asset strategies.',
          assetAllocation: { equity: 70, debt: 20, goldRealEstate: 10 },
          badgeColor: '#C7A76C',
        },
        {
          minScore: 17,
          maxScore: 20,
          title: 'Financial Fitness: Wealth Champion',
          category: 'Peak Financial Vitality',
          description: 'Outstanding! Your financial health is in the top 5% of investors. You possess disciplined cashflow management, low debt, and comprehensive protection.',
          recommendation: 'Focus on estate succession planning, generational wealth transfer, and high-yield wealth preservation strategies.',
          assetAllocation: { equity: 75, debt: 15, goldRealEstate: 10 },
          badgeColor: '#10243A',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Questionnaires seeded.');

  // 8. Insurers for Pay Premium Online
  console.log('🛡️ Seeding Insurers...');
  const InsurerColl = db.collection('insurers');
  await InsurerColl.deleteMany({});
  await InsurerColl.insertMany([
    {
      name: 'Life Insurance Corporation of India (LIC)',
      category: 'Life Insurance',
      logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop',
      paymentPortalUrl: 'https://ebiz.licindia.in/D2CPM/#Register',
      helpline: '022-68276827',
      description: 'Official direct premium payment portal for all individual and group LIC life policies.',
      order: 0,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'HDFC Life Insurance',
      category: 'Life Insurance',
      logoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop',
      paymentPortalUrl: 'https://cp.hdfclife.com/quick-pay',
      helpline: '1800-266-9777',
      description: 'Pay renewal premiums for HDFC Life Click 2 Protect, savings, and retirement policies.',
      order: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'ICICI Prudential Life Insurance',
      category: 'Life Insurance',
      logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop',
      paymentPortalUrl: 'https://www.iciciprulife.com/online-premium-payment.html',
      helpline: '1860-266-7766',
      description: 'Instant online premium payment with net banking, UPI, debit, and credit cards.',
      order: 2,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'SBI Life Insurance',
      category: 'Life Insurance',
      logoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=300&auto=format&fit=crop',
      paymentPortalUrl: 'https://mypolicy.sbilife.co.in/PremiumPayment',
      helpline: '1800-267-9090',
      description: 'Quick pay renewal facility for SBI Life eShield, Smart Shield, and pension plans.',
      order: 3,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Star Health and Allied Insurance',
      category: 'Health Insurance',
      logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=300&auto=format&fit=crop',
      paymentPortalUrl: 'https://www.starhealth.in/quick-renewal',
      helpline: '1800-425-2255',
      description: 'Official renewal portal for Star Comprehensive, Family Health Optima, and Senior Citizen plans.',
      order: 4,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Tata AIG General Insurance',
      category: 'General Insurance',
      logoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=300&auto=format&fit=crop',
      paymentPortalUrl: 'https://www.tataaig.com/quick-renew',
      helpline: '1800-266-7780',
      description: 'Pay renewals for Tata AIG health, motor, and business property insurances.',
      order: 5,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Insurers seeded.');

  // 9. Market Indices & News Items
  console.log('📈 Seeding Market Indices & News...');
  const IndexColl = db.collection('marketindices');
  await IndexColl.deleteMany({});
  await IndexColl.insertMany([
    {
      symbol: 'SENSEX',
      name: 'BSE SENSEX',
      currentValue: 81380.5,
      change: 312.4,
      percentChange: 0.39,
      high52: 85978.25,
      low52: 70319.04,
      isPositive: true,
      source: 'BSE India (Curated)',
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      symbol: 'NIFTY50',
      name: 'NIFTY 50',
      currentValue: 24835.2,
      change: 96.8,
      percentChange: 0.39,
      high52: 26277.35,
      low52: 21285.55,
      isPositive: true,
      source: 'NSE India (Curated)',
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      symbol: 'BANKNIFTY',
      name: 'NIFTY BANK',
      currentValue: 51210.15,
      change: 180.5,
      percentChange: 0.35,
      high52: 54467.35,
      low52: 44429.05,
      isPositive: true,
      source: 'NSE India (Curated)',
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      symbol: 'GOLD',
      name: 'MCX GOLD (10g)',
      currentValue: 76450.0,
      change: -120.0,
      percentChange: -0.16,
      high52: 79775.0,
      low52: 59550.0,
      isPositive: false,
      source: 'MCX India (Curated)',
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const NewsColl = db.collection('newsitems');
  await NewsColl.deleteMany({});
  await NewsColl.insertMany([
    {
      tab: 'popular',
      title: 'Indian Mutual Fund Industry AUM Crosses ₹67 Lakh Crore Milestone',
      summary: 'Spurred by record monthly SIP inflows exceeding ₹23,000 Crore, domestic retail participation hits an all-time high across equity categories.',
      source: 'AMFI Monthly Bulletin',
      url: '/blog',
      publishedAt: new Date(),
      badge: 'Industry Milestone',
      isFeatured: true,
      order: 0,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tab: 'popular',
      title: 'RBI Keeps Repo Rate Steady at 6.5%: What It Means for Your Fixed Deposits & Loans',
      summary: 'With inflation within the comfort band, the central bank maintains a balanced monetary stance. Advisors suggest locking into peak corporate FD yields.',
      source: 'Finasset Research Desk',
      url: '/blog',
      publishedAt: new Date(),
      badge: 'Interest Rate Insight',
      isFeatured: false,
      order: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tab: 'ipo',
      title: 'Upcoming Mainboard & SME IPO Pipeline: Key Offerings to Watch This Quarter',
      summary: 'Strong domestic liquidity continues to fuel primary market appetite across renewable energy, fintech, and specialty healthcare sectors.',
      source: 'SEBI Filings Desk',
      url: '/market-update',
      publishedAt: new Date(),
      badge: 'Primary Market',
      isFeatured: true,
      order: 0,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tab: 'ipo',
      title: 'RERA Compliance & Grey Market Premium (GMP): Evaluating New Real Estate IPOs',
      summary: 'Institutional quality real estate investment trusts (REITs) and developers see heightened interest from high net-worth investors.',
      source: 'Finasset Market Note',
      url: '/market-update',
      publishedAt: new Date(),
      badge: 'Real Estate / REIT',
      isFeatured: false,
      order: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tab: 'market',
      title: 'Nifty 50 Holds Firm Above Key Moving Averages Amid Strong Corporate Earnings',
      summary: 'Capital goods, banking, and infrastructure stocks drive momentum as foreign institutional selling is met with robust domestic mutual fund buying.',
      source: 'Finasset Technical Desk',
      url: '/market-update',
      publishedAt: new Date(),
      badge: 'Technical Snapshot',
      isFeatured: true,
      order: 0,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tab: 'market',
      title: 'Long-Term Capital Gains (LTCG) Rule Changes: Strategic Portfolio Rebalancing',
      summary: 'Analysis of the 12.5% LTCG tax regime and how smart tax-loss harvesting can optimize your overall post-tax portfolio returns.',
      source: 'Finasset Taxation Desk',
      url: '/taxation',
      publishedAt: new Date(),
      badge: 'Tax Optimization',
      isFeatured: false,
      order: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Market indices and news seeded.');

  // 10. Testimonials & Partners
  console.log('🤝 Seeding Testimonials & Partners...');
  const TestimonialColl = db.collection('testimonials');
  await TestimonialColl.deleteMany({});
  await TestimonialColl.insertMany([
    {
      clientName: 'Dr. Debabrata Mohapatra',
      designation: 'Senior Consultant Surgeon',
      location: 'Bhubaneswar, Odisha',
      reviewText: 'Managing a bustling clinical practice left me zero time to analyze investments. The team at Finasset Wealth structured my entire portfolio, aligned my mutual funds to my children’s medical degrees, and automated my family term covers. Their transparency is refreshing.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
      serviceUsed: 'Comprehensive Wealth & PMS Advisory',
      order: 0,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      clientName: 'Subhasree Patnaik',
      designation: 'Technology Executive (NRI, Dubai)',
      location: 'Dubai / Bhubaneswar',
      reviewText: 'As an NRI living in the UAE, navigating NRE accounts, FEMA regulations, and real estate purchases back home in Odisha was daunting. Finasset Wealth handled the entire repatriation compliance and mutual fund allocation smoothly.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
      serviceUsed: 'NRI Wealth & Taxation Advisory',
      order: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      clientName: 'Ramesh Chandra Jena',
      designation: 'Managing Director, Jena Infrastructure',
      location: 'Cuttack / Bhubaneswar',
      reviewText: 'The risk profiling and retirement roadmap created by Finasset Wealth gave my family tremendous peace of mind. We have been working together for over 8 years, and their guidance through market downturns has been exceptional.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      serviceUsed: 'Retirement & Fixed Income Planning',
      order: 2,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const PartnerColl = db.collection('partners');
  await PartnerColl.deleteMany({});
  await PartnerColl.insertMany([
    { name: 'HDFC Mutual Fund', category: 'Mutual Fund AMC', logoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=300&auto=format&fit=crop', websiteUrl: 'https://www.hdfcfund.com', order: 0, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'ICICI Prudential Mutual Fund', category: 'Mutual Fund AMC', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop', websiteUrl: 'https://www.icicipruamc.com', order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'SBI Mutual Fund', category: 'Mutual Fund AMC', logoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=300&auto=format&fit=crop', websiteUrl: 'https://www.sbimf.com', order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Nippon India Mutual Fund', category: 'Mutual Fund AMC', logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=300&auto=format&fit=crop', websiteUrl: 'https://mf.nipponindiaim.com', order: 3, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Mirae Asset Mutual Fund', category: 'Mutual Fund AMC', logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=300&auto=format&fit=crop', websiteUrl: 'https://www.miraeassetmf.co.in', order: 4, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Kotak Mahindra Mutual Fund', category: 'Mutual Fund AMC', logoUrl: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?q=80&w=300&auto=format&fit=crop', websiteUrl: 'https://www.kotakmf.com', order: 5, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log('✅ Testimonials and partners seeded.');

  // 11. Blog Posts
  console.log('📰 Seeding Blog Posts...');
  const BlogColl = db.collection('blogposts');
  await BlogColl.deleteMany({});
  await BlogColl.insertMany([
    {
      title: 'How Systematic Investment Plans (SIP) Beat Market Volatility Over Decades',
      slug: 'how-sip-beats-market-volatility-over-decades',
      excerpt: 'Discover why timing the market is a futile exercise compared to time IN the market. Real numerical case studies showing 15-year SIP returns across bull and bear cycles.',
      content: `### The Futility of Market Timing

Every market investor has pondered the question: *"Should I wait for a 10% market correction before deploying my money?"* Historical data proves unequivocally that waiting on the sidelines incurs massive opportunity costs.

When you invest through a **Systematic Investment Plan (SIP)**, market corrections transform from a psychological menace into your greatest wealth multiplier. 

#### Rupee Cost Averaging Explained

1. In high markets, your monthly installment buys fewer units at higher NAVs.
2. In low markets, that identical installment buys a significantly larger number of units.
3. When the inevitable bull cycle returns, the accumulated low-cost units supercharge your total portfolio net asset value.

### Numerical Proof: 15-Year Rolling Returns
A comprehensive study of the Nifty 50 TRI index over rolling 10-year and 15-year periods reveals that negative returns on SIP investments held for over 7 years drop to **zero percent**. Meanwhile, the median annualized CAGR exceeds **12.8% to 14.2%**.

### Actionable Takeaway for Odisha Investors
Automate your SIPs on the 1st or 5th of each month right after your salary or business cashflow arrives. Treat your SIP commitment with the same priority as your home loan EMI.`,
      category: 'Mutual Funds',
      author: 'Finasset Research Desk',
      featuredImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop',
      tags: ['Mutual Funds', 'SIP', 'Compounding', 'Wealth Creation'],
      readingTime: '5 min read',
      isPublished: true,
      publishedAt: new Date(Date.now() - 3 * 86400000),
      metaTitle: 'How SIP Beats Market Volatility Over Decades | Finasset Wealth',
      metaDescription: 'Learn why Systematic Investment Plans (SIP) remain the most disciplined vehicle for long-term Indian equity wealth accumulation.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Tax-Efficient Wealth Creation: Maximizing LTCG, STCG, and Section 80C',
      slug: 'tax-efficient-wealth-creation-ltcg-stcg-section-80c',
      excerpt: 'Comprehensive guide to the updated capital gains tax rules in India. How to legally harvest gains, save taxes under Section 54, and choose between Old vs New tax regimes.',
      content: `### Understanding the New Tax Architecture

Gross return is vanity; net post-tax return is sanity. In financial planning, an investment strategy that ignores tax drag leaks substantial capital over a 20-year horizon.

#### Equity Capital Gains Under the Updated Regime
- **Long-Term Capital Gains (LTCG):** Investments held for more than 12 months in equity schemes are taxed at **12.5%** on gains exceeding the annual threshold of **₹1.25 Lakh**.
- **Short-Term Capital Gains (STCG):** Investments redeemed before 12 months are taxed at **20%**.

### Strategic Tax-Loss and Tax-Gain Harvesting
By strategically redeeming equity mutual fund units towards the end of each financial year up to the ₹1.25 Lakh exemption limit and immediately reinvesting, you reset your cost basis higher with zero tax liability. Over two decades, this simple technique saves lakhs in final tax outgo.

### Old vs. New Tax Regime: The Investor Dilemma
While the New Tax Regime offers lower slab rates, it eliminates Chapter VI-A deductions (80C, 80D, 24b). For families servicing substantial home loans and maintaining high health insurance covers, the Old Tax Regime may still deliver superior post-tax cashflow savings.`,
      category: 'Tax Planning',
      author: 'Finasset Taxation Desk',
      featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
      tags: ['Taxation', 'LTCG', 'Section 80C', 'Capital Gains'],
      readingTime: '6 min read',
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 86400000),
      metaTitle: 'Tax-Efficient Wealth Creation in India | Finasset Wealth',
      metaDescription: 'Master Indian capital gains taxation, LTCG harvesting, and tax-efficient portfolio rebalancing with Finasset Wealth experts.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'NRI Investment in India: Demystifying NRE, NRO, FEMA Regulations and Repatriation',
      slug: 'nri-investment-india-fema-repatriation-taxation',
      excerpt: 'Essential roadmap for Non-Resident Indians seeking to invest in Indian equities, mutual funds, and commercial real estate while staying 100% FEMA compliant.',
      content: `### Why Global NRIs Are Flocking to the Indian Growth Engine

With India projected to become the world’s third-largest economy before 2030, Non-Resident Indians across the UAE, USA, UK, Singapore, and Canada are actively looking to deploy surplus capital in domestic asset classes.

#### Demystifying Bank Accounts: NRE vs. NRO
1. **NRE (Non-Resident External) Account:** Repatriable at will. Principal and interest are completely exempt from Indian income tax. Ideal for depositing foreign currency earnings.
2. **NRO (Non-Resident Ordinary) Account:** Non-repatriable beyond USD 1 Million per financial year (subject to Form 15CA/15CB). Used for managing income earned in India such as rental yields, dividends, or pension.

### Direct Mutual Fund Investments for NRIs
Contrary to common belief, NRIs can invest in Indian mutual funds seamlessly through digital KYC. While US and Canada-based NRIs face compliance restrictions from certain AMCs due to FATCA/CRS guidelines, dozens of leading Indian AMCs accept investments without friction.`,
      category: 'NRI Corner',
      author: 'Finasset NRI Desk',
      featuredImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop',
      tags: ['NRI', 'FEMA', 'NRE Account', 'Repatriation'],
      readingTime: '7 min read',
      isPublished: true,
      publishedAt: new Date(Date.now() - 12 * 86400000),
      metaTitle: 'NRI Investment in India Guide | Finasset Wealth',
      metaDescription: 'Complete NRI guide to NRE/NRO accounts, mutual funds, FEMA compliance, and funds repatriation back home.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Blog posts seeded.');

  // 12. Dynamic Content Pages
  console.log('📄 Seeding Pages...');
  const PageColl = db.collection('pages');
  await PageColl.deleteMany({});
  await PageColl.insertMany([
    {
      slug: 'about-us',
      title: 'About Finasset Wealth',
      bannerTitle: 'Pioneering Ethical Wealth Management in Odisha',
      bannerSubtitle: 'Finasset Wealth is a proud group of NLF Adhira Asset Services LLP, headquartered in the temple city of Bhubaneswar.',
      heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      mainContent: 'Founded with a resolute commitment to financial integrity, Finasset Wealth bridges the gap between complex financial markets and individual aspirations. As a premier wealth management and financial advisory practice in Bhubaneswar, we cater to retail investors, doctors, senior corporate executives, business owners, and Non-Resident Indians.',
      sections: [
        {
          heading: 'Our Corporate Heritage — NLF Adhira Asset Services LLP',
          subHeading: 'Grounded in institutional discipline and client-first fiduciary ethics',
          body: 'Operating under the umbrella of NLF Adhira Asset Services LLP, Finasset Wealth combines the rigor of institutional investment analysis with the personalized empathy of a private family office. We manage multi-asset portfolios spanning mutual funds, insurance, real estate advisory, and portfolio management services (PMS).',
          bulletPoints: ['AMFI Registered Mutual Fund Distributor', '15+ Years Combined Advisory Heritage in Odisha', 'Transparent Fiduciary Guidance with Zero Hidden Agendas', 'Client-Centric Life-Stage Planning'],
          imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
          order: 0,
        },
        {
          heading: 'Our Core Philosophies',
          subHeading: 'Principles that guide every portfolio decision we execute',
          body: 'We believe that wealth creation is a marathon, not a sprint. We do not chase speculative fads, promise unrealistic guaranteed returns, or push proprietary high-commission products. Instead, our investment philosophy rests on asset allocation, disciplined rupee-cost averaging, and rigorous risk containment.',
          bulletPoints: ['Disciplined Asset Allocation over Speculation', 'Goal-Oriented Portfolios with Clear Exit Triggers', 'Continuous Review and Rebalancing', 'Empathetic Client Communication in Good and Bad Markets'],
          imageUrl: '',
          order: 1,
        },
      ],
      metaTitle: 'About Us | Finasset Wealth - NLF Adhira Asset Services LLP',
      metaDescription: 'Learn about Finasset Wealth, a group of NLF Adhira Asset Services LLP, Bhubaneswar. Our team, values, and client-first wealth management approach.',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'nri-corner',
      title: 'NRI Corner',
      bannerTitle: 'Specialized Wealth Advisory for Non-Resident Indians',
      bannerSubtitle: 'Seamless, compliant investment avenues in India for global NRIs across the Middle East, North America, Europe, and Asia-Pacific.',
      heroImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop',
      mainContent: 'Non-Resident Indians represent a vital engine of the global economy. Yet, managing investments in India while residing thousands of miles away often entails navigating daunting regulatory frameworks, changing tax treaties, and complicated paperwork. Finasset Wealth acts as your trusted on-ground fiduciary in Bhubaneswar.',
      sections: [
        {
          heading: 'End-to-End NRI Advisory Suite',
          subHeading: 'Covering every aspect of your financial footprint in India',
          body: 'We assist with establishing KYC compliance, linking NRE and NRO bank accounts, managing property acquisitions, setting up systematic investment plans, and ensuring seamless repatriation of funds under RBI guidelines.',
          bulletPoints: ['NRE & NRO Account Banking Facilitation', '100% Compliant Mutual Fund & SIP Portfolios', 'Real Estate Portfolio Diligence & Property Management', 'Repatriation Guidance under Form 15CA & 15CB', 'Double Taxation Avoidance Agreement (DTAA) Advisory'],
          imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop',
          order: 0,
        },
      ],
      metaTitle: 'NRI Investment & Wealth Advisory | Finasset Wealth Bhubaneswar',
      metaDescription: 'Specialized NRI wealth management, FEMA compliance, mutual funds, real estate advisory, and taxation assistance in Bhubaneswar, Odisha.',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'taxation',
      title: 'Taxation & Regulatory Planning',
      bannerTitle: 'Strategic Tax Planning for Superior Net Returns',
      bannerSubtitle: 'Navigate capital gains taxes, Section 80C/80D optimizations, and estate succession with our experienced wealth team.',
      heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop',
      mainContent: 'Tax planning is an integral facet of holistic financial planning. An investment that delivers 15% pre-tax returns can be severely degraded if taxable events are not structured with foresight. Finasset Wealth collaborates with leading chartered accountants to harmonize your investment portfolio with current tax laws.',
      sections: [
        {
          heading: 'Key Areas of Tax Advisory',
          subHeading: 'Structuring your wealth to minimize legal tax liabilities',
          body: 'We advise on Long-Term Capital Gains (LTCG) harvesting, Short-Term Capital Gains management, Section 54/54EC exemptions for real estate transactions, and tax deductions available under the Old vs New Tax Regimes.',
          bulletPoints: ['Annual LTCG Exemption (₹1.25 Lakh) Harvesting Strategies', 'Section 54EC Capital Gains Bonds Placement', 'Health Insurance Tax Rebates under Section 80D', 'Taxation on NRI Repatriation and Dividend Distributions'],
          imageUrl: '',
          order: 0,
        },
      ],
      metaTitle: 'Taxation & Capital Gains Planning | Finasset Wealth',
      metaDescription: 'Maximize post-tax portfolio returns with strategic capital gains harvesting, Section 80C/80D advice, and real estate tax planning.',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'career',
      title: 'Careers at Finasset Wealth',
      bannerTitle: 'Shape the Future of Wealth Management in Odisha',
      bannerSubtitle: 'Join a high-performance team dedicated to ethical advisory, financial innovation, and client success.',
      heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      mainContent: 'At Finasset Wealth (NLF Adhira Asset Services LLP), our greatest asset is our talent. We foster a culture of intellectual curiosity, rigorous financial research, and uncompromising integrity. If you are passionate about capital markets and client advisory, we welcome you to grow with us.',
      sections: [
        {
          heading: 'Current Career Opportunities in Bhubaneswar',
          subHeading: 'Explore positions across wealth advisory, research, and client relations',
          body: 'We are currently accepting applications for the following roles at our Bhubaneswar office: Senior Wealth Manager (AMFI/NISM certified with 3+ years experience), Financial Research Analyst (Equity & Mutual Funds), and Client Relationship Associate.',
          bulletPoints: ['Competitive fixed compensation + performance-linked bonuses', 'Continuous learning and NISM/CFP certification sponsorships', 'Direct mentorship from seasoned market leaders', 'Transparent and meritocratic career progression'],
          imageUrl: '',
          order: 0,
        },
      ],
      metaTitle: 'Careers | Finasset Wealth Bhubaneswar',
      metaDescription: 'Explore career opportunities in wealth management, financial planning, and investment research with Finasset Wealth in Bhubaneswar.',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      bannerTitle: 'Privacy Policy & Data Protection',
      bannerSubtitle: 'How Finasset Wealth protects and respects your personal and financial information.',
      heroImage: '',
      mainContent: 'Finasset Wealth (A Group of NLF Adhira Asset Services LLP) is committed to safeguarding the privacy and confidentiality of personal and financial information entrusted to us by our clients and website visitors. We collect only information essential to deliver advisory services, comply with AMFI/SEBI regulations, and execute investment mandates.',
      sections: [
        {
          heading: 'Information We Collect and How It Is Used',
          subHeading: 'Strict adherence to Indian data privacy regulations',
          body: 'We collect personal identification data (name, email, phone number, PAN, address) solely for client onboarding, KYC verification, and communication. We never sell, rent, or trade client information to third-party telemarketers or unauthorized entities. Data is encrypted in transit and at rest using industry-standard protocols.',
          bulletPoints: ['Zero selling or trading of client data', 'Encrypted database storage and secure transmission', 'Access restricted exclusively to authorized fiduciaries'],
          imageUrl: '',
          order: 0,
        },
      ],
      metaTitle: 'Privacy Policy | Finasset Wealth',
      metaDescription: 'Read the privacy policy and data protection framework of Finasset Wealth, Bhubaneswar.',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'terms-of-service',
      title: 'Terms of Service',
      bannerTitle: 'Terms of Service & Regulatory Disclaimers',
      bannerSubtitle: 'Please review the terms and conditions governing the use of the Finasset Wealth website and advisory services.',
      heroImage: '',
      mainContent: 'By accessing the Finasset Wealth website, you agree to comply with and be bound by the following terms. Mutual fund investments are subject to market risks; please read all scheme-related documents carefully before investing. Finasset Wealth operates as an AMFI-registered mutual fund distributor and wealth management consultant.',
      sections: [
        {
          heading: 'Regulatory Disclaimers & AMFI Compliance',
          subHeading: 'Important legal notices regarding financial tools and calculators',
          body: 'All calculators, financial fitness assessments, and risk profile questionnaires provided on this website are for educational and illustrative purposes only. Past performance is not indicative of future returns. Projections generated do not guarantee future portfolio performance or capital safety.',
          bulletPoints: ['Mutual Fund investments are subject to market risks', 'Calculators provide illustrative, non-guaranteed estimates', 'Consult certified advisors before executing financial decisions'],
          imageUrl: '',
          order: 0,
        },
      ],
      metaTitle: 'Terms of Service | Finasset Wealth',
      metaDescription: 'Regulatory terms, disclaimers, and terms of service for Finasset Wealth.',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Content pages seeded.');

  // 13. Seed Enquiries
  console.log('📬 Seeding Sample Enquiries...');
  const EnquiryColl = db.collection('enquiries');
  await EnquiryColl.deleteMany({});
  await EnquiryColl.insertMany([
    {
      type: 'callback',
      name: 'Pradeep Kumar Mohanty',
      phone: '+91 98610 54321',
      email: 'pradeep.mohanty@example.com',
      serviceOfInterest: 'Mutual Funds & SIP',
      preferredTime: 'Morning (10:00 AM - 12:00 PM)',
      message: 'Looking to start a ₹50,000 monthly SIP portfolio for my daughter’s future education.',
      sourcePage: 'Homepage Call Back Form',
      status: 'NEW',
      notes: [],
      ipAddress: '127.0.0.1',
      createdAt: new Date(Date.now() - 2 * 3600000),
      updatedAt: new Date(Date.now() - 2 * 3600000),
    },
    {
      type: 'contact',
      name: 'Ananya Rath',
      phone: '+91 94371 88990',
      email: 'ananya.rath@example.com',
      serviceOfInterest: 'Financial Planning',
      preferredTime: 'Evening (4:00 PM - 6:00 PM)',
      message: 'Need a comprehensive financial plan before taking voluntary retirement from corporate service.',
      sourcePage: 'Contact Us Page',
      status: 'CONTACTED',
      notes: [{ note: 'Called client on 14th Oct. Scheduled in-person meeting at Bhubaneswar office on Saturday.', adminName: 'Admin', createdAt: new Date() }],
      ipAddress: '127.0.0.1',
      createdAt: new Date(Date.now() - 24 * 3600000),
      updatedAt: new Date(),
    },
  ]);
  console.log('✅ Sample enquiries seeded.');

  console.log('\n======================================================');
  console.log('🎉 FINASSET WEALTH SEED COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
  console.log(`🔑 Administrator Email:    ${adminEmail}`);
  console.log(`🔑 Administrator Password: ${process.env.INITIAL_ADMIN_PASSWORD || 'Finasset@Admin2026!'}`);
  console.log('======================================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed encountered an unexpected error:', err);
  process.exit(1);
});
