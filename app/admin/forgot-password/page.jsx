'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSuccessMsg(data.message);
      if (data.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
    } catch {
      setSuccessMsg('Request received. If the email is registered, instructions have been generated.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2b44] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Sign In</span>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-[#f87b1f] flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white">Reset Admin Password</h1>
            <p className="text-xs text-slate-400">
              Enter your registered administrator email to receive a secure, single-use reset token.
            </p>
          </div>

          {successMsg ? (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-5 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-[#89b441] mx-auto" />
              <p className="text-xs text-slate-200 leading-relaxed">{successMsg}</p>
              {devResetUrl && (
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 block mb-1">Development Quick Link:</span>
                  <Link
                    href={devResetUrl}
                    className="inline-block bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow"
                  >
                    Open Reset Password Page
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@finassetwealth.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#2376b8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-[#f87b1f]/20"
              >
                {loading ? 'Dispatching...' : 'Send Password Reset Token'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
