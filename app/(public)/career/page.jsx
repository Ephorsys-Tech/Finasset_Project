'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Send,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';

export default function CareerPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Senior Wealth Manager', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: 'career',
          serviceOfInterest: `Career Application: ${form.role}`,
          sourcePage: 'Career Page',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', role: 'Senior Wealth Manager', message: '' });
      }
    } catch {
      alert('Failed to submit application. Please email your CV to careers@finassetwealth.com.');
    } finally {
      setSubmitting(false);
    }
  };

  const openings = [
    {
      title: 'Senior Wealth Manager',
      location: 'Bhubaneswar, Odisha',
      type: 'Full-time',
      experience: '3 - 6 Years',
      description: 'Advise high-net-worth clients, manage mutual fund portfolios, and deliver goal-based wealth blueprints. NISM Series V-A certification required.',
    },
    {
      title: 'Mutual Fund & Equity Research Analyst',
      location: 'Bhubaneswar, Odisha',
      type: 'Full-time',
      experience: '2 - 4 Years',
      description: 'Conduct quantitative fund manager tracking, rolling returns analysis, asset allocation models, and prepare macro-economic market notes.',
    },
    {
      title: 'Client Relationship Officer',
      location: 'Bhubaneswar, Odisha',
      type: 'Full-time',
      experience: '1 - 3 Years',
      description: 'Oversee investor onboarding, digital KYC verification, periodic portfolio review dispatches, and client query resolution.',
    },
  ];

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <PageHero
        title="Careers at Finasset Wealth"
        description="Build a rewarding career in ethical wealth management, research, and client relationship advisory at our Bhubaneswar headquarters."
        imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Careers at Finasset Wealth"
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Current Openings */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-2">
                Explore Roles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44] mt-1">
                Current Opportunities in Bhubaneswar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {openings.map((job, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1 text-[#2376b8] font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span>{job.experience}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0f2b44]">{job.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <button
                      onClick={() => {
                        setForm((prev) => ({ ...prev, role: job.title }));
                        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-[#2376b8] hover:bg-[#1b5d92] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-sm"
                    >
                      Apply for this Role
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div id="apply-form" className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-1">
                Candidate Application
              </span>
              <h2 className="text-2xl font-bold text-[#0f2b44]">
                Submit Your Application to Our Talent Desk
              </h2>
              <p className="text-xs text-slate-500">
                Tell us about your experience and qualifications.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-950/60 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#89b441] mx-auto" />
                <h3 className="text-lg font-bold text-white">Application Received</h3>
                <p className="text-xs text-slate-300">
                  Our HR talent desk will review your credentials and contact you for initial discussions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sambit Mishra"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94370..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sambit@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                      Applying For Role
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                    >
                      <option value="Senior Wealth Manager">Senior Wealth Manager</option>
                      <option value="Mutual Fund & Equity Research Analyst">Mutual Fund & Equity Research Analyst</option>
                      <option value="Client Relationship Officer">Client Relationship Officer</option>
                      <option value="General Wealth Internship">General Wealth Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                    Summary of Qualifications, Certifications & LinkedIn Profile
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention NISM / AMFI certifications, current organization, and LinkedIn link..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-extrabold text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-[#f87b1f]/20"
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Job Application'}
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    You can also email your updated resume directly to careers@finassetwealth.com.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
