'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const router = useRouter();

  // Step: 1 ('email') | 2 ('otp') | 3 ('reset')
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/v1/admin/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(data.message || 'A 6-digit OTP has been sent to your email.');
        setStep(2);
      } else {
        setError(data.message || 'Unable to process request.');
      }
    } catch {
      setError('Network error. Could not dispatch password reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/v1/admin/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (data.success && data.data?.resetToken) {
        setResetToken(data.data.resetToken);
        setSuccess('OTP verified successfully! Please create your new password.');
        setStep(3);
      } else {
        setError(data.message || 'Invalid or expired OTP code.');
      }
    } catch {
      setError('Network error while verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res = await fetch('/api/v1/admin/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('A new OTP has been dispatched to your email.');
      } else {
        setError(data.message || 'Failed to resend OTP.');
      }
    } catch {
      setError('Network error while resending OTP.');
    } finally {
      setResending(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/v1/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          resetToken,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Password updated successfully! Redirecting to sign in...');
        setTimeout(() => {
          router.push('/admin/login');
        }, 1500);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch {
      setError('Network error while updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10243A] flex flex-col justify-center items-center p-4 selection:bg-[#C7A76C] selection:text-[#10243A]">
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
            <div className="w-12 h-12 rounded-xl bg-white/10 text-[#C7A76C] flex items-center justify-center mx-auto">
              {step === 1 && <KeyRound className="w-6 h-6" />}
              {step === 2 && <ShieldCheck className="w-6 h-6" />}
              {step === 3 && <Lock className="w-6 h-6" />}
            </div>
            <h1 className="text-xl font-bold text-white">
              {step === 1 && 'Reset Admin Password'}
              {step === 2 && 'Enter Verification OTP'}
              {step === 3 && 'Create New Password'}
            </h1>
            <p className="text-xs text-slate-400">
              {step === 1 && 'Enter your registered administrator email to receive an OTP code.'}
              {step === 2 && `Enter the 6-digit OTP code sent to ${email}.`}
              {step === 3 && 'Choose a strong new password with at least 8 characters.'}
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-2">
            <span className={`h-1.5 rounded-full transition-all ${step === 1 ? 'w-8 bg-[#C7A76C]' : 'w-2 bg-slate-700'}`} />
            <span className={`h-1.5 rounded-full transition-all ${step === 2 ? 'w-8 bg-[#C7A76C]' : 'w-2 bg-slate-700'}`} />
            <span className={`h-1.5 rounded-full transition-all ${step === 3 ? 'w-8 bg-[#C7A76C]' : 'w-2 bg-slate-700'}`} />
          </div>

          {error && (
            <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
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
                className="w-full bg-[#C7A76C] hover:bg-[#dfc593] disabled:opacity-50 text-[#10243A] font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Dispatching...' : 'Send 6-Digit OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xl tracking-[0.5em] text-center font-mono focus:outline-none focus:border-[#C7A76C]"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:text-white underline"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[#C7A76C] hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>Resend OTP</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-[#C7A76C] hover:bg-[#dfc593] disabled:opacity-50 text-[#10243A] font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#C7A76C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#C7A76C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C7A76C] hover:bg-[#dfc593] disabled:opacity-50 text-[#10243A] font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Saving...' : 'Update Password & Return to Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
