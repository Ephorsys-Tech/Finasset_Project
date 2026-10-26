'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { formatDate } from '@/lib/utils';
import { useBlogStore } from '@/store/useBlogStore';

export default function BlogListingPage() {
  const {
    posts,
    categories,
    selectedCategory,
    searchQuery,
    isLoading: loading,
    fetchPosts,
    setSelectedCategory,
    setSearchQuery,
  } = useBlogStore();

  useEffect(() => {
    fetchPosts({ category: selectedCategory, search: searchQuery });
  }, [selectedCategory, searchQuery, fetchPosts]);

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <PageHero
        title="Financial Insights & Market Notes"
        description="Practical investment perspectives, capital gains strategies, compounding breakdowns, and NRI guidance written by Finasset Wealth researchers."
        imageSrc="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Financial Insights & Market Notes"
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Controls: Categories & Search */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-[#2376b8] text-white shadow-sm'
                    : 'bg-[#f8fafc] text-slate-600 hover:text-[#2376b8]'
                }`}
              >
                All Articles
              </button>
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === c.name
                      ? 'bg-[#2376b8] text-white shadow-sm'
                      : 'bg-[#f8fafc] text-slate-600 hover:text-[#2376b8]'
                  }`}
                >
                  {c.name} ({c.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
              />
            </div>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Loading articles...
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <h3 className="text-lg font-bold text-[#0f2b44]">No articles found</h3>
              <p className="text-xs text-slate-500 mt-1">Try another category or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {post.featuredImage && (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-[#0f2b44] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                          {post.category}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium">
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

                      <h2 className="text-xl font-bold text-[#0f2b44] mb-3 leading-snug group-hover:text-[#2376b8] transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {post.excerpt || post.description || post.content}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-500 font-semibold">{post.author}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-[#f87b1f] group-hover:text-[#d9620b] flex items-center gap-1 transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
