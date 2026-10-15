'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function PayPremiumPage() {
  const [insurers, setInsurers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v1/public/insurers')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setInsurers(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredInsurers = insurers.filter((ins) => {
    const matchesCategory = categoryFilter === 'All' || ins.category === categoryFilter;
    const matchesSearch = ins.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#F8F7F3]">
      {/* Banner */}
      <section className="bg-[#10243A] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/30 text-[#dfc593] text-xs font-bold uppercase tracking-wider mb-4">
            <CreditCard className="w-3.5 h-3.5 text-[#C7A76C]" />
            <span>Direct Insurer Payment Portals</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Pay Insurance Premium Online
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            Direct, verified one-click payment gateways for your ongoing policy renewals across leading life, health, and general insurance companies in India.
          </p>
        </div>
      </section>

      {/* Insurers List & Filters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Life Insurance', 'Health Insurance', 'General Insurance'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === cat
                      ? 'bg-[#10243A] text-white shadow-sm'
                      : 'bg-[#F8F7F3] text-slate-600 hover:text-[#10243A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search insurer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8F7F3] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>
          </div>

          {/* Insurers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInsurers.map((ins) => (
              <div
                key={ins._id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C7A76C] bg-[#C7A76C]/10 px-2.5 py-1 rounded-full">
                      {ins.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#C7A76C]" />
                      <span>{ins.helpline}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#10243A] mb-2">{ins.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {ins.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={ins.paymentPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Official Payment Gateway</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C7A76C]" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Helpful Instructions */}
          <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#10243A]">
              <Info className="w-4 h-4 text-[#C7A76C]" />
              <span>Important Tips for Online Insurance Premium Payments</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A76C] shrink-0 mt-0.5" />
                <span>Always verify your exact Policy Number and Date of Birth before submitting payment.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A76C] shrink-0 mt-0.5" />
                <span>Download and save the official digitally signed premium renewal receipt for Section 80C/80D tax filing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A76C] shrink-0 mt-0.5" />
                <span>Payment through UPI, Net Banking, and Debit Cards avoids credit card convenience surcharges.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A76C] shrink-0 mt-0.5" />
                <span>Contact Finasset Wealth client desk if you encounter any policy renewal or endorsement difficulties.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
