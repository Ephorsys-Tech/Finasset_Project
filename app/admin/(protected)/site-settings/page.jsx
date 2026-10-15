'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  Mail,
  Globe,
  Share2,
  Lock,
} from 'lucide-react';

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('/api/v1/admin/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSettings(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Site settings saved and applied successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to save settings' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-slate-400">Loading site settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#10243A]">Site Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage firm branding, Bhubaneswar contact details, external portal links, and AMFI credentials.
        </p>
      </div>

      {statusMessage.text && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#10243A]">Corporate Identity & Disclosures</h2>
            <p className="text-xs text-slate-400">Firm naming and regulatory AMFI registration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={settings?.brandName || ''}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Corporate Entity (Subtitle)
              </label>
              <input
                type="text"
                value={settings?.subTitle || ''}
                onChange={(e) => setSettings({ ...settings, subTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings?.tagLine || ''}
                onChange={(e) => setSettings({ ...settings, tagLine: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                AMFI Registration (ARN)
              </label>
              <input
                type="text"
                value={settings?.amfiRegistrationNumber || ''}
                onChange={(e) => setSettings({ ...settings, amfiRegistrationNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Admin Notification Email
              </label>
              <input
                type="email"
                value={settings?.adminNotificationEmail || ''}
                onChange={(e) => setSettings({ ...settings, adminNotificationEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>
          </div>
        </div>

        {/* Office Contact Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#10243A]">Bhubaneswar Office & Contact Information</h2>
            <p className="text-xs text-slate-400">Publicly visible contact numbers, emails, and address.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Primary Advisory Phone
              </label>
              <input
                type="text"
                value={settings?.phone1 || ''}
                onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Secondary / Board Phone
              </label>
              <input
                type="text"
                value={settings?.phone2 || ''}
                onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={settings?.email1 || ''}
                onChange={(e) => setSettings({ ...settings, email1: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings?.email2 || ''}
                onChange={(e) => setSettings({ ...settings, email2: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Physical Office Address (Bhubaneswar)
              </label>
              <input
                type="text"
                value={settings?.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>
          </div>
        </div>

        {/* External Portals & Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#10243A]">External Client Portals & Social Media</h2>
            <p className="text-xs text-slate-400">Configure external login engines and platform links.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Client Portfolio Login URL
              </label>
              <input
                type="url"
                value={settings?.externalPortfolioUrl || ''}
                onChange={(e) => setSettings({ ...settings, externalPortfolioUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Buy MF Online Transacting URL
              </label>
              <input
                type="url"
                value={settings?.externalBuyMfUrl || ''}
                onChange={(e) => setSettings({ ...settings, externalBuyMfUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                LinkedIn Company URL
              </label>
              <input
                type="url"
                value={settings?.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10243A] uppercase mb-1">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={settings?.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#10243A] hover:bg-[#1b3858] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#C7A76C]" />
            <span>{saving ? 'Saving Settings...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
