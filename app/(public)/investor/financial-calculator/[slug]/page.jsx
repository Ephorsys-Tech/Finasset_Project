import { notFound } from 'next/navigation';
import { ALL_CALCULATORS } from '@/lib/calculatorsData';
import CalculatorDetailClient from '@/components/calculators/CalculatorDetailClient';

export function generateStaticParams() {
  return Object.keys(ALL_CALCULATORS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = ALL_CALCULATORS[slug];
  if (!tool) {
    return {
      title: 'Calculator Not Found | Finasset Wealth',
    };
  }

  return {
    title: `${tool.title} | Finasset Financial Calculators`,
    description: tool.desc,
  };
}

export default async function CalculatorSlugPage({ params }) {
  const { slug } = await params;
  const tool = ALL_CALCULATORS[slug];

  if (!tool) {
    notFound();
  }

  return <CalculatorDetailClient slug={slug} tool={tool} />;
}
