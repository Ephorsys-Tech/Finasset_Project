# Finasset Wealth — Official Web Platform & Administrative CMS

**A Group of NLF Adhira Asset Services LLP, Bhubaneswar, Odisha**

A modern, production-grade wealth management platform and administrative content management system built with Next.js App Router, Tailwind CSS, and MongoDB Atlas (Mongoose). Engineered in pure JavaScript (`.js`, `.jsx`).

---

## 🏛️ Brand & Architectural Overview

- **Firm**: Finasset Wealth (NLF Adhira Asset Services LLP)
- **Headquarters**: Plot No. 124, Saheed Nagar, Janpath Road, Bhubaneswar, Odisha – 751007
- **Design System**: Luxury wealth aesthetic featuring Deep Navy (`#10243A`), Antique Gold (`#C7A76C`), Warm Sand (`#F8F7F3`), and Slate accents.
- **Frontend & Fullstack API**: Next.js 15 (App Router) with React 19.
- **Database Layer**: MongoDB Atlas with Mongoose ODM (cached connection pooling).
- **Security**: JWT short-lived access tokens (15m), rotating refresh tokens (7d) in HttpOnly secure cookies, bcrypt password hashing (12 rounds), account lockout protection (5 failed attempts), and full activity audit logging.

---

## 📁 Project Structure

```text
finasset-wealth/
├── app/                               # Next.js App Router (Pages, Layouts & Thin API Connectors)
│   ├── (public)/                      # Public routes (Navbar & Footer rendered)
│   │   ├── page.jsx                   # Homepage (Hero carousel, market data, services, tools)
│   │   ├── about-us/page.jsx          # Heritage, leadership, & NLF Adhira credentials
│   │   ├── services/                  # Service catalog & dynamic service detail
│   │   ├── investor/                  # Investor Corner & Interactive Tools
│   │   ├── nri-corner/page.jsx        # NRI repatriation, NRE/NRO taxation & advisory
│   │   ├── taxation/page.jsx          # Capital gains, Section 80C, LTCG tax planning
│   │   ├── market-update/page.jsx     # Live NSE/BSE indices & curated market research
│   │   ├── career/page.jsx            # Open roles & career application portal
│   │   ├── blog/                      # Insights & Financial Education
│   │   ├── contact-us/page.jsx        # Bhubaneswar HQ interactive enquiry form & map
│   │   ├── portfolio-login/page.jsx   # Client portal gateway
│   │   ├── privacy-policy/page.jsx    # Regulatory compliance & privacy disclosures
│   │   └── terms-of-service/page.jsx  # AMFI & legal terms of engagement
│   │
│   ├── admin/                         # Administrative Portal (Protected)
│   │   ├── login/page.jsx             # Admin authentication gateway
│   │   ├── forgot-password/page.jsx   # Password reset request
│   │   ├── reset-password/page.jsx    # Secure token password update
│   │   └── (protected)/               # Admin CMS modules
│   │       ├── dashboard/page.jsx     # Real-time metrics & recent enquiries
│   │       ├── enquiries/page.jsx     # Lead management, status updates, & CSV export
│   │       ├── site-settings/page.jsx # Contact info, AMFI ARN, social links
│   │       ├── services/page.jsx      # Service catalog CRUD & FAQ builder
│   │       ├── home-page/page.jsx     # Hero slider & homepage section manager
│   │       ├── menus/page.jsx         # Header & footer navigation structure
│   │       ├── investor-corner/page.jsx# Investor tool cards & configuration
│   │       ├── pay-premium/page.jsx   # Insurers list & direct portal links
│   │       ├── calculators/page.jsx   # Calculator presets & default rates
│   │       ├── questionnaires/page.jsx# Risk & fitness psychometric questions
│   │       ├── news-market/page.jsx   # Market indices & editorial news
│   │       ├── testimonials/page.jsx  # Client reviews & ratings
│   │       ├── partners/page.jsx      # AMC & insurer logos
│   │       ├── pages/page.jsx         # Dynamic custom pages CMS
│   │       ├── blog/page.jsx          # Article publishing with SEO metadata
│   │       ├── media/page.jsx         # Digital asset library
│   │       └── activity-log/page.jsx  # Security audit trail
│   │
│   ├── api/v1/                        # Serverless API endpoints -> Connects to backend/controllers/
│   │   ├── auth/                      # Login, refresh, logout, me, reset-password
│   │   ├── public/                    # Home, services, tools, blog, market, enquiry
│   │   └── admin/                     # Dashboard, settings, CMS CRUD, CSV export
│   │
│   ├── error.jsx                      # Client error boundary
│   ├── not-found.jsx                  # Custom 404 page
│   ├── loading.jsx                    # Suspense loading state
│   ├── globals.css                    # Tailwind CSS base styles & typography
│   └── layout.jsx                     # Root application wrapper & font definitions
│
├── backend/                           # Decoupled Backend Architecture
│   ├── config/                        # Database & environment configurations
│   │   ├── db.js                      # MongoDB Atlas connection pooling
│   │   └── env.js                     # Environment variable validation & secrets
│   ├── controllers/                   # Request handlers (receives req, delegates to services)
│   │   ├── authController.js          # Auth requests (login, refresh, logout, reset)
│   │   ├── enquiryController.js       # Lead capture, enquiries list, updates, CSV export
│   │   ├── serviceController.js       # Wealth services CRUD & slug resolution
│   │   ├── homeController.js          # Homepage data & hero slides
│   │   ├── investorController.js      # Tools, questionnaires, insurers
│   │   ├── contentController.js       # Settings, menus, blog, pages, testimonials, partners, market
│   │   └── adminController.js         # Dashboard stats, media, activity audit logs
│   ├── services/                      # Core Business Logic Layer
│   │   ├── authService.js             # Password hashing, JWT signing, lockout, token rotation
│   │   ├── enquiryService.js          # Rate-limited lead creation, status workflows, CSV formatting
│   │   ├── serviceService.js          # Services persistence & catalog business rules
│   │   ├── homeService.js             # Composite homepage dataset & zero-downtime fallback
│   │   ├── investorService.js         # Tools and questionnaire scoring
│   │   ├── contentService.js          # Content CMS operations
│   │   └── adminService.js            # KPI metrics aggregation & media
│   ├── models/                        # 19 Mongoose Schemas & Models
│   │   ├── Admin.js, RefreshToken.js, PasswordResetToken.js, ActivityLog.js
│   │   ├── SiteSettings.js, Menu.js, HeroSlide.js, Service.js, InvestorTool.js
│   │   ├── Questionnaire.js, Insurer.js, NewsItem.js, MarketIndex.js
│   │   ├── Testimonial.js, Partner.js, BlogPost.js, Page.js, Enquiry.js, Media.js
│   │   └── index.js
│   ├── lib/                           # Backend utility libraries
│   │   └── auth.js                    # JWT access/refresh utilities & session verification
│   ├── middleware/                    # Request Middleware
│   │   └── authMiddleware.js          # Admin cookie/bearer authentication guard
│   ├── utils/                         # Helper functions
│   │   ├── apiResponse.js             # Standardized HTTP response helpers
│   │   └── logger.js                  # Audit and application logger
│   └── validators/                    # Request Payload Validation (Zod)
│       ├── authValidator.js           # Login, reset-password schemas
│       └── enquiryValidator.js        # Contact and callback schemas
│
├── components/                        # React UI Components
│   ├── common/                        # Reusable UI widgets (LoadingSpinner, SectionHeader)
│   ├── layout/                        # Navbar, Footer
│   └── ui/                            # ToastContainer, dialogs, form elements
├── lib/                               # Client utilities & helpers
│   ├── apiFetch.js                    # Fetch wrapper with credentials & headers
│   ├── constants.js                   # Project constants, brand info, navigation
│   ├── fallbackData.js                # Curated fallback dataset for zero-downtime resilience
│   ├── seo.js                         # Next.js Metadata API generator
│   └── utils.js                       # Indian Rupee formatting (Lakhs/Crores), SIP math
├── services/                          # Frontend API client consumers
│   ├── apiClient.js                   # HTTP client wrapper
│   ├── admin.js                       # Admin API requests
│   ├── auth.js                        # Authentication client
│   ├── public.js                      # Public website API requests
│   └── index.js                       # Centralized exports
├── store/                             # State management
│   ├── authStore.js                   # Admin session store
│   └── toastStore.js                  # Reactive notification toast manager
├── context/
│   └── Providers.jsx                  # Client context providers
├── scripts/
│   └── seed.js                        # Database seeder with full production dataset
├── middleware.js                      # Next.js route guard for admin pages
└── next.config.js                     # Next.js configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher
- **MongoDB**: MongoDB Atlas URI or local MongoDB instance running on `mongodb://localhost:27017`

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/finasset_wealth

# Security & JWT Secrets
JWT_ACCESS_SECRET=finasset_access_secret_super_secure_key_change_in_prod
JWT_REFRESH_SECRET=finasset_refresh_secret_super_secure_key_change_in_prod
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Admin Seed Defaults
ADMIN_EMAIL=admin@finassetwealth.com
ADMIN_PASSWORD=Finasset@Admin2026!
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed Database
Seed the database with the initial Administrator account, site settings, services, calculators, questionnaires, and news:
```bash
npm run seed
```

Default credentials:
- **Email**: `admin@finassetwealth.com`
- **Password**: `Finasset@Admin2026!`

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
The Admin CMS is accessible at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 🔒 Security Architecture

1. **HttpOnly Cookie Authentication**:
   - Access Token (`15m` expiry) and Refresh Token (`7d` expiry) stored strictly in HttpOnly, SameSite, Secure cookies.
   - Mitigates Cross-Site Scripting (XSS) token extraction.
2. **Refresh Token Rotation**:
   - Each refresh token can only be used once. If a replayed token is detected, all sessions for that admin are invalidated.
3. **Brute Force Lockout**:
   - 5 consecutive failed login attempts trigger an automatic 15-minute lockout on the account.
4. **Audit Logging**:
   - Administrative actions (login, service update, enquiry status change) are recorded in the `ActivityLog` collection with IP and timestamp.
5. **Rate Limiting**:
   - Public enquiry submissions are throttled per IP to prevent spam submissions.

---

## 💼 Business Logic & Interactive Calculators

- **SIP & Lumpsum Calculator**:
  - Implements standard compound interest and annuity formulas:
    $$\text{FV} = P \times \frac{(1 + i)^n - 1}{i} \times (1 + i)$$
  - Renders yearly wealth appreciation breakdowns and asset split diagrams.
- **Risk Profiling Diagnostic**:
  - 5-stage psychometric evaluation calculating scores across Conservative, Moderate, Growth, and Aggressive tiers with tailored asset allocations.
- **Lead Capture & Processing**:
  - All public inquiries (Contact, Callback, Career, Consultation) are stored in MongoDB with unique tracking numbers and managed via the Admin Dashboard.
  - One-click CSV export available for external CRM integration.

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 📄 Compliance & Regulatory Disclaimer

Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully.
Finasset Wealth is a group of NLF Adhira Asset Services LLP, Bhubaneswar (ARN-189204).
