'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Send,
  Shield,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';

export default function ContactUsPage() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceOfInterest: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch dynamic published services created by admin (matches navbar services section)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      if (serviceParam) {
        setForm((prev) => ({ ...prev, serviceOfInterest: serviceParam }));
      }
    }

    fetch('/api/v1/public/services')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setServices(json.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load services for contact form:', err);
      })
      .finally(() => {
        setLoadingServices(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/v1/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: 'contact',
          sourcePage: 'Contact Us Page',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({
          name: '',
          phone: '',
          email: '',
          serviceOfInterest: '',
          message: '',
        });
      } else {
        setError(data.message || 'Failed to submit enquiry');
      }
    } catch {
      setError('Network error. Please call our office directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <PageHero
        title="Connect With Finasset Wealth"
        description="We welcome you to visit our office in Bhubaneswar or reach out via phone and email. Our senior wealth consultants are ready to assist you."
        imageSrc="https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Connect With Finasset Wealth"
      />

      {/* Main Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-2">
                    Corporate Office
                  </span>
                  <h2 className="text-2xl font-bold text-[#0f2b44]">
                    Finasset Wealth Headquarters
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    A Group of NLF Adhira Asset Services LLP
                  </p>
                </div>

                <div className="space-y-5 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#2376b8] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0f2b44]">Registered Office Address:</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Plot No. 124, Ground & 1st Floor, Saheed Nagar / Jaydev Vihar Corridor, Bhubaneswar, Odisha – 751007, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0f2b44]">Telephone & Direct Lines:</h4>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        +91 94370 12345 (Client Advisory)
                      </p>
                      <p className="text-xs text-slate-600">
                        +91 674 2548900 (Board Line)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#f87b1f] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0f2b44]">Email Communication:</h4>
                      <p className="text-xs text-slate-600 mt-1">contact@finassetwealth.com</p>
                      <p className="text-xs text-slate-600">support@adhiraassets.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#2376b8] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0f2b44]">Advisory Office Timings:</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Monday – Saturday: 9:30 AM – 6:30 PM
                      </p>
                      <p className="text-xs text-slate-400">
                        Sunday: Prior Appointment Only
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#89b441] shrink-0" />
                  <span>AMFI Registered Mutual Fund Distributor: ARN-189204</span>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm h-64">
                <iframe
                  title="Finasset Wealth Bhubaneswar Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.53374944738!2d85.75042079999999!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            </div>

            {/* Interactive Contact Form (7 cols) */}
            <div id="callback" className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-2">
                  Online Inquiry
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44]">
                  Send a Confidential Message
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details and an advisor will connect with you promptly.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-950/60 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#89b441] mx-auto" />
                  <h3 className="text-lg font-bold text-white">Message Dispatched</h3>
                  <p className="text-sm text-slate-300">
                    Thank you! Your inquiry has been routed to our Bhubaneswar wealth team. We will call or email you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#f87b1f] font-semibold underline mt-2 block mx-auto"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priyabrata Das"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 94370 12345"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="priyabrata@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                        Advisory Area
                      </label>
                      <select
                        value={form.serviceOfInterest}
                        onChange={(e) => setForm({ ...form, serviceOfInterest: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                      >
                        <option value="">
                          {loadingServices ? 'Loading services...' : 'Select Advisory Area'}
                        </option>
                        {services.map((service) => (
                          <option key={service._id || service.slug || service.name} value={service.name}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                      Your Message / Financial Questions
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share details regarding your investment goals, portfolio size, or questions..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-extrabold text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-[#f87b1f]/20"
                    >
                      {submitting ? 'Dispatching Message...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
