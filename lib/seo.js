import { BRAND } from './constants';

/**
 * Generate Next.js dynamic metadata for SEO
 */
export function constructMetadata({
  title,
  description = BRAND.description,
  image = '/og-image.jpg',
  keywords = [
    'wealth management bhubaneswar',
    'financial advisor odisha',
    'mutual funds consultant',
    'sip calculator',
    'pms services bhubaneswar',
    'finasset wealth',
    'nlf adhira asset services',
    'tax planning',
    'nri investments',
  ],
  noIndex = false,
  canonical,
} = {}) {
  const metaTitle = title
    ? `${title} | ${BRAND.name}`
    : `${BRAND.name} — Wealth Management & Financial Advisory Bhubaneswar`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://finassetwealth.com';
  const url = canonical ? `${baseUrl}${canonical}` : baseUrl;

  return {
    title: metaTitle,
    description,
    keywords: keywords.join(', '),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: metaTitle,
      description,
      url,
      siteName: BRAND.name,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
      creator: '@finassetwealth',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
