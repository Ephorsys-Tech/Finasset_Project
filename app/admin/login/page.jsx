'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  // Mode: 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset'
  const [mode, setMode] = useState('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resending, setResending] = useState(false);

  // 1. Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Authentication successful. Redirecting to dashboard...');
        let targetUrl = '/admin/dashboard';
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const redirectParam = params.get('redirect');
          if (
            redirectParam &&
            redirectParam.startsWith('/admin') &&
            !redirectParam.startsWith('/admin/login')
          ) {
            targetUrl = redirectParam;
          }
        }
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 400);
      } else {
        setError(data.message || 'Invalid email or password credentials');
      }
    } catch {
      setError('Network error. Unable to contact authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/v1/admin/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(data.message || 'A 6-digit OTP has been dispatched to your email.');
        setMode('forgot-otp');
      } else {
        setError(data.message || 'Failed to dispatch password reset OTP.');
      }
    } catch {
      setError('Network error. Could not dispatch password reset email.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/admin/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp }),
      });

      const data = await res.json();
      if (data.success && data.data?.resetToken) {
        setResetToken(data.data.resetToken);
        setSuccess('OTP verified successfully! Now set your new password.');
        setMode('forgot-reset');
      } else {
        setError(data.message || 'Invalid or expired OTP code.');
      }
    } catch {
      setError('Network error. Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Helper
  const handleResendOtp = async () => {
    setResending(true);
    setError('');
    try {
      const res = await fetch('/api/v1/admin/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('A new OTP has been sent to your email.');
      } else {
        setError(data.message || 'Failed to resend OTP.');
      }
    } catch {
      setError('Network error while resending OTP.');
    } finally {
      setResending(false);
    }
  };

  // 4. Step 3: Save New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/v1/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          resetToken,
          password: newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Password updated successfully! Please sign in with your new password.');
        setEmail(resetEmail);
        setPassword('');
        setOtp('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        setMode('login');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch {
      setError('Network error while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10243A] flex flex-col justify-center items-center p-4 selection:bg-[#C7A76C] selection:text-[#10243A]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#f87b1f] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#f87b1f]/20">
            <TrendingUp className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            FINASSET <span className="text-[#2376b8]">WEALTH</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Administrative CMS & Portfolio Control Center
          </p>
        </div>

        {/* Dynamic Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Header Title depending on Mode */}
          <div className="border-b border-slate-800 pb-4">
            {mode === 'login' && (
              <>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C7A76C]" />
                  <span>Administrator Sign In</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Authorized personnel only. Sessions are encrypted and monitored.
                </p>
              </>
            )}

            {mode === 'forgot-email' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#C7A76C]" />
                    <span>Reset Password</span>
                  </h2>
                  <button
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccess('');
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Step 1 of 3: Enter your registered admin email to receive an OTP.
                </p>
              </>
            )}

            {mode === 'forgot-otp' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C7A76C]" />
                    <span>Verify Reset OTP</span>
                  </h2>
                  <button
                    onClick={() => {
                      setMode('forgot-email');
                      setError('');
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Change Email
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Step 2 of 3: Enter the 6-digit OTP code sent to <strong className="text-slate-300">{resetEmail}</strong>.
                </p>
              </>
            )}

            {mode === 'forgot-reset' && (
              <>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C7A76C]" />
                  <span>Create New Password</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Step 3 of 3: Enter and confirm your new administrator password.
                </p>
              </>
            )}
          </div>

          {/* Feedback Alerts */}
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

          {/* 1. LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@finassetwealth.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#C7A76C]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email || '');
                      setError('');
                      setSuccess('');
                      setMode('forgot-email');
                    }}
                    className="text-xs text-[#C7A76C] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C7A76C] hover:bg-[#dfc593] disabled:opacity-50 text-[#10243A] font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Admin CMS'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* 2. FORGOT PASSWORD STEP 1: EMAIL ENTRY */}
          {mode === 'forgot-email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Registered Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@finassetwealth.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#C7A76C]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C7A76C] hover:bg-[#dfc593] disabled:opacity-50 text-[#10243A] font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Sending Verification OTP...' : 'Send 6-Digit OTP to Email'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD STEP 2: VERIFY OTP */}
          {mode === 'forgot-otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Enter 6-Digit OTP Code
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
                <span>Didn&apos;t receive email?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-[#C7A76C] hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>Resend OTP</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-[#C7A76C] hover:bg-[#dfc593] disabled:opacity-50 text-[#10243A] font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Verifying OTP...' : 'Verify OTP Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* 4. FORGOT PASSWORD STEP 3: NEW PASSWORD */}
          {mode === 'forgot-reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#C7A76C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#C7A76C]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C7A76C] hover:bg-[#dfc593] disabled:opacity-50 text-[#10243A] font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Updating Password...' : 'Save Password & Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Default credentials note for development */}
          {mode === 'login' && (
            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center space-y-1">
              <div>Default Admin: <code className="text-slate-300">admin@finassetwealth.com</code></div>
              <div>Default Password: <code className="text-slate-300">Finasset@Admin2026!</code></div>
            </div>
          )}
        </div>

        {/* Back to Public Site */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Finasset Wealth Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
