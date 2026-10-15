'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Share2,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function BlogDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/public/blog/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBlogData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-[#10243A] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold">Loading article...</p>
      </div>
    );
  }

  const post = blogData?.post;
  const relatedPosts = blogData?.relatedPosts || [];

  if (!post) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-[#10243A]">Article Not Found</h1>
        <p className="text-slate-500 text-sm mt-2">
          The requested financial article does not exist or has been archived.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-block bg-[#10243A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          Back to Blog Listing
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F7F3] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#10243A] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
          <div className="space-y-4">
            <span className="inline-block bg-[#10243A] text-[#dfc593] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10243A] tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-100 pb-6">
              <span className="font-bold text-[#10243A]">{post.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime || '5 min read'}
              </span>
            </div>
          </div>

          {post.featuredImage && (
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-[360px] sm:h-[440px] object-cover"
              />
            </div>
          )}

          {/* Body Content */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line space-y-4">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400" />
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Consultation Callout */}
          <div className="bg-[#10243A] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Have questions about this strategy?</h3>
              <p className="text-xs text-slate-300">
                Discuss how this aligns with your personal portfolio with our certified advisors in Bhubaneswar.
              </p>
            </div>
            <Link
              href="/contact-us#callback"
              className="bg-[#C7A76C] hover:bg-[#dfc593] text-[#10243A] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shrink-0"
            >
              Consult an Advisor
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl font-bold text-[#10243A]">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-sm text-[#10243A] group-hover:text-[#C7A76C] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <div className="text-[11px] font-bold text-[#C7A76C] mt-4 flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
