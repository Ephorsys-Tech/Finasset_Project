// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import {
//   Lock,
//   Mail,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   ArrowLeft,
//   TrendingUp,
//   AlertCircle,
//   CheckCircle2,
//   KeyRound,
//   ShieldCheck,
//   RefreshCw,
//   X,
// } from 'lucide-react';

// export default function AdminLoginPage() {
//   const router = useRouter();

//   // Mode: 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset'
//   const [mode, setMode] = useState('login');

//   // Login form state
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Top-right Toast notification state (auto-dismisses after 5 seconds)
//   const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }
//   const toastTimeoutRef = useRef(null);

//   const showToast = (message, type = 'success') => {
//     if (!message) return;
//     if (toastTimeoutRef.current) {
//       clearTimeout(toastTimeoutRef.current);
//     }
//     setToast({ message, type });
//     toastTimeoutRef.current = setTimeout(() => {
//       setToast(null);
//     }, 5000);
//   };

//   useEffect(() => {
//     return () => {
//       if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
//     };
//   }, []);

//   // Password reset state
//   const [resetEmail, setResetEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [resetToken, setResetToken] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [resending, setResending] = useState(false);

//   // 1. Handle Admin Login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch('/api/v1/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         showToast(data.message || 'Authentication successful. Redirecting to dashboard...', 'success');
//         let targetUrl = '/admin/dashboard';
//         if (typeof window !== 'undefined') {
//           const params = new URLSearchParams(window.location.search);
//           const redirectParam = params.get('redirect');
//           if (
//             redirectParam &&
//             redirectParam.startsWith('/admin') &&
//             !redirectParam.startsWith('/admin/login')
//           ) {
//             targetUrl = redirectParam;
//           }
//         }
//         setTimeout(() => {
//           window.location.href = targetUrl;
//         }, 500);
//       } else {
//         showToast(data.message || 'Invalid email or password credentials', 'error');
//       }
//     } catch {
//       showToast('Network error. Unable to contact authentication server.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Step 1: Send OTP to Email
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch('/api/v1/admin/forget-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: resetEmail }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         showToast(data.message, 'success');
//         setMode('forgot-otp');
//       } else {
//         showToast(data.message || 'Failed to dispatch password reset OTP.', 'error');
//       }
//     } catch {
//       showToast('Network error. Could not dispatch password reset email.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. Step 2: Verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch('/api/v1/admin/verify-reset-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: resetEmail, otp }),
//       });

//       const data = await res.json();
//       if (data.success && data.data?.resetToken) {
//         setResetToken(data.data.resetToken);
//         showToast(data.message, 'success');
//         setMode('forgot-reset');
//       } else {
//         showToast(data.message || 'Invalid or expired OTP code.', 'error');
//       }
//     } catch {
//       showToast('Network error. Failed to verify OTP.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend OTP Helper
//   const handleResendOtp = async () => {
//     setResending(true);
//     try {
//       const res = await fetch('/api/v1/admin/forget-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: resetEmail }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         showToast(data.message, 'success');
//       } else {
//         showToast(data.message || 'Failed to resend OTP.', 'error');
//       }
//     } catch {
//       showToast('Network error while resending OTP.', 'error');
//     } finally {
//       setResending(false);
//     }
//   };

//   // 4. Step 3: Save New Password
//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       showToast('Password and confirm password do not match.', 'error');
//       return;
//     }

//     if (newPassword.length < 8) {
//       showToast('Password must be at least 8 characters long.', 'error');
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch('/api/v1/admin/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: resetEmail,
//           resetToken,
//           password: newPassword,
//           confirmPassword,
//         }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         showToast(data.message, 'success');
//         setEmail(resetEmail);
//         setPassword('');
//         setOtp('');
//         setResetToken('');
//         setNewPassword('');
//         setConfirmPassword('');
//         setMode('login');
//       } else {
//         showToast(data.message || 'Failed to reset password.', 'error');
//       }
//     } catch {
//       showToast('Network error while resetting password.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[100dvh] bg-[#10243A] flex flex-col justify-center items-center px-4 py-8 sm:py-12 md:py-16 selection:bg-[#C7A76C] selection:text-[#10243A] relative overflow-x-hidden">
//       {/* Ambient background glows for rich depth */}
//       <div className="absolute -top-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-[#f87b1f]/10 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute -bottom-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-[#2376b8]/10 rounded-full blur-3xl pointer-events-none" />

//       {/* Top-Right Floating Toast Notification (Auto-disappears after 5s) */}
//       {toast && (
//         <div
//           role="status"
//           aria-live="polite"
//           className="fixed top-4 sm:top-6 right-3 sm:right-6 left-3 sm:left-auto z-50 max-w-sm sm:max-w-md w-auto sm:w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
//         >
//           <div
//             className={`flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-md border ${
//               toast.type === 'success'
//                 ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/40 shadow-emerald-950/50'
//                 : 'bg-rose-950/95 text-rose-100 border-rose-500/40 shadow-rose-950/50'
//             }`}
//           >
//             {toast.type === 'success' ? (
//               <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
//             ) : (
//               <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
//             )}

//             <div className="flex-1 pr-1 min-w-0">
//               <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 text-white">
//                 {toast.type === 'success' ? 'Success' : 'Notice / Error'}
//               </h4>
//               <p className="text-xs leading-relaxed font-medium text-slate-200 break-words">
//                 {toast.message}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => {
//                 if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
//                 setToast(null);
//               }}
//               className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
//               aria-label="Dismiss notification"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="w-full max-w-md my-auto space-y-5 sm:space-y-6 relative z-10">
//         {/* Brand Header */}
//         <div className="text-center space-y-1.5 sm:space-y-2">
//           <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#f87b1f] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#f87b1f]/20">
//             <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
//           </div>
//           <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
//             FINASSET <span className="text-[#2376b8]">WEALTH</span>
//           </h1>
//           <p className="text-[11px] sm:text-xs text-slate-400 font-medium px-2">
//             Administrative CMS & Portfolio Control Center
//           </p>
//         </div>

//         {/* Dynamic Card Container */}
//         <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl space-y-5 sm:space-y-6">
//           {/* Header Title depending on Mode */}
//           <div className="border-b border-slate-800 pb-3.5 sm:pb-4">
//             {mode === 'login' && (
//               <>
//                 <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
//                   <Lock className="w-4 h-4 text-[#C7A76C]" />
//                   <span>Administrator Sign In</span>
//                 </h2>
//                 <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
//                   Authorized personnel only. Sessions are encrypted and monitored.
//                 </p>
//               </>
//             )}

//             {mode === 'forgot-email' && (
//               <>
//                 <div className="flex items-center justify-between gap-2">
//                   <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
//                     <KeyRound className="w-4 h-4 text-[#C7A76C] shrink-0" />
//                     <span>Reset Password</span>
//                   </h2>
//                   <button
//                     onClick={() => setMode('login')}
//                     className="text-[11px] sm:text-xs text-slate-400 hover:text-white flex items-center gap-1 shrink-0 py-1"
//                   >
//                     <ArrowLeft className="w-3.5 h-3.5" /> Back
//                   </button>
//                 </div>
//                 <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
//                   Step 1 of 3: Enter your registered admin email to receive an OTP.
//                 </p>
//               </>
//             )}

//             {mode === 'forgot-otp' && (
//               <>
//                 <div className="flex items-center justify-between gap-2">
//                   <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
//                     <ShieldCheck className="w-4 h-4 text-[#C7A76C] shrink-0" />
//                     <span>Verify Reset OTP</span>
//                   </h2>
//                   <button
//                     onClick={() => setMode('forgot-email')}
//                     className="text-[11px] sm:text-xs text-slate-400 hover:text-white flex items-center gap-1 shrink-0 py-1"
//                   >
//                     <ArrowLeft className="w-3.5 h-3.5" /> Change Email
//                   </button>
//                 </div>
//                 <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
//                   Step 2 of 3: Enter the 6-digit OTP code sent to{' '}
//                   <strong className="text-slate-200 break-all">{resetEmail}</strong>.
//                 </p>
//               </>
//             )}

//             {mode === 'forgot-reset' && (
//               <>
//                 <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
//                   <Lock className="w-4 h-4 text-[#C7A76C]" />
//                   <span>Create New Password</span>
//                 </h2>
//                 <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
//                   Step 3 of 3: Enter and confirm your new administrator password.
//                 </p>
//               </>
//             )}
//           </div>

//           {/* 1. LOGIN FORM */}
//           {mode === 'login' && (
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div>
//                 <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
//                   Admin Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="email"
//                     required
//                     placeholder="admin@finassetwealth.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-[#C7A76C] transition-colors"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-1.5">
//                   <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
//                     Password
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setResetEmail(email || '');
//                       setMode('forgot-email');
//                     }}
//                     className="text-[11px] sm:text-xs text-[#C7A76C] hover:underline font-semibold"
//                   >
//                     Forgot Password?
//                   </button>
//                 </div>
//                 <div className="relative">
//                   <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     required
//                     placeholder="••••••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-10 pr-10 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-[#C7A76C] transition-colors"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
//                     aria-label={showPassword ? 'Hide password' : 'Show password'}
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[#C7A76C] hover:bg-[#dfc593] active:scale-[0.99] disabled:opacity-50 text-[#10243A] font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
//                 >
//                   <span>{loading ? 'Authenticating...' : 'Sign In to Admin CMS'}</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* 2. FORGOT PASSWORD STEP 1: EMAIL ENTRY */}
//           {mode === 'forgot-email' && (
//             <form onSubmit={handleSendOtp} className="space-y-4">
//               <div>
//                 <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
//                   Registered Admin Email
//                 </label>
//                 <div className="relative">
//                   <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="email"
//                     required
//                     placeholder="admin@finassetwealth.com"
//                     value={resetEmail}
//                     onChange={(e) => setResetEmail(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-[#C7A76C] transition-colors"
//                   />
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[#C7A76C] hover:bg-[#dfc593] active:scale-[0.99] disabled:opacity-50 text-[#10243A] font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
//                 >
//                   <span>{loading ? 'Sending Verification OTP...' : 'Send 6-Digit OTP to Email'}</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* 3. FORGOT PASSWORD STEP 2: VERIFY OTP */}
//           {mode === 'forgot-otp' && (
//             <form onSubmit={handleVerifyOtp} className="space-y-4">
//               <div>
//                 <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
//                   Enter 6-Digit OTP Code
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={6}
//                   required
//                   placeholder="123456"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
//                   className="w-full px-3 py-3 sm:py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-lg sm:text-xl tracking-[0.35em] sm:tracking-[0.5em] text-center font-mono focus:outline-none focus:border-[#C7A76C] transition-colors"
//                 />
//               </div>

//               <div className="flex justify-between items-center text-[11px] sm:text-xs text-slate-400">
//                 <span>Didn&apos;t receive email?</span>
//                 <button
//                   type="button"
//                   onClick={handleResendOtp}
//                   disabled={resending}
//                   className="text-[#C7A76C] hover:underline font-semibold flex items-center gap-1 py-1"
//                 >
//                   <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
//                   <span>Resend OTP</span>
//                 </button>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={loading || otp.length < 6}
//                   className="w-full bg-[#C7A76C] hover:bg-[#dfc593] active:scale-[0.99] disabled:opacity-50 text-[#10243A] font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
//                 >
//                   <span>{loading ? 'Verifying OTP...' : 'Verify OTP Code'}</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* 4. FORGOT PASSWORD STEP 3: NEW PASSWORD */}
//           {mode === 'forgot-reset' && (
//             <form onSubmit={handleResetPassword} className="space-y-4">
//               <div>
//                 <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
//                   New Password (min 8 chars)
//                 </label>
//                 <div className="relative">
//                   <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type={showNewPassword ? 'text' : 'password'}
//                     required
//                     placeholder="••••••••••••"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="w-full pl-10 pr-10 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-[#C7A76C] transition-colors"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowNewPassword(!showNewPassword)}
//                     className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
//                     aria-label={showNewPassword ? 'Hide password' : 'Show password'}
//                   >
//                     {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
//                   Confirm New Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type={showNewPassword ? 'text' : 'password'}
//                     required
//                     placeholder="••••••••••••"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-[#C7A76C] transition-colors"
//                   />
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[#C7A76C] hover:bg-[#dfc593] active:scale-[0.99] disabled:opacity-50 text-[#10243A] font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
//                 >
//                   <span>{loading ? 'Updating Password...' : 'Save Password & Sign In'}</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </form>
//           )}

//         </div>

//         {/* Back to Public Site */}
//         <div className="text-center pt-1">
//           <Link
//             href="/"
//             className="text-[11px] sm:text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 py-1"
//           >
//             ← Return to Finasset Wealth Public Website
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useRef } from 'react';
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
  X,
} from 'lucide-react';

/* ---------- Shared responsive class names ---------- */
// text-base on mobile (16px) stops iOS Safari from zooming on focus; sm:text-sm on larger screens
const inputBase =
  'w-full min-h-[44px] py-2.5 sm:py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-base sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#C7A76C] focus:ring-2 focus:ring-[#C7A76C]/20 transition-colors';

const labelClass =
  'block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5';

const primaryBtn =
  'w-full min-h-[44px] bg-[#C7A76C] hover:bg-[#dfc593] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-[#10243A] font-bold text-sm py-3 sm:py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A76C]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

const backBtn =
  'text-[11px] sm:text-xs text-slate-400 hover:text-white flex items-center gap-1 shrink-0 min-h-[36px] px-1 transition-colors';

const cardTitle =
  'text-base sm:text-lg font-bold text-white flex items-center gap-2 min-w-0';

const cardSubtitle = 'text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed';

export default function AdminLoginPage() {
  // Mode: 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset'
  const [mode, setMode] = useState('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Top-right Toast notification state (auto-dismisses after 5 seconds)
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (!message) return;
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

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

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        showToast(data.message || 'Authentication successful. Redirecting to dashboard...', 'success');
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
        }, 500);
      } else {
        showToast(data.message || 'Invalid email or password credentials', 'error');
      }
    } catch {
      showToast('Network error. Unable to contact authentication server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/admin/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setMode('forgot-otp');
      } else {
        showToast(data.message || 'Failed to dispatch password reset OTP.', 'error');
      }
    } catch {
      showToast('Network error. Could not dispatch password reset email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/admin/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp }),
      });

      const data = await res.json();
      if (data.success && data.data?.resetToken) {
        setResetToken(data.data.resetToken);
        showToast(data.message, 'success');
        setMode('forgot-reset');
      } else {
        showToast(data.message || 'Invalid or expired OTP code.', 'error');
      }
    } catch {
      showToast('Network error. Failed to verify OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Helper
  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/v1/admin/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Failed to resend OTP.', 'error');
      }
    } catch {
      showToast('Network error while resending OTP.', 'error');
    } finally {
      setResending(false);
    }
  };

  // 4. Step 3: Save New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Password and confirm password do not match.', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
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
        showToast(data.message, 'success');
        setEmail(resetEmail);
        setPassword('');
        setOtp('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        setMode('login');
      } else {
        showToast(data.message || 'Failed to reset password.', 'error');
      }
    } catch {
      showToast('Network error while resetting password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-[100dvh] w-full bg-[#10243A] flex flex-col items-center
                 px-4 sm:px-6 lg:px-8
                 py-6 sm:py-10 md:py-14
                 [@media(max-height:520px)]:py-4
                 selection:bg-[#C7A76C] selection:text-[#10243A]"
    >
      {/* Ambient background glows — clipped inside their own layer so they can never create page scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 sm:-top-32 sm:-right-32 w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#f87b1f]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 sm:-bottom-32 sm:-left-32 w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#2376b8]/10 rounded-full blur-3xl" />
      </div>

      {/* Top-Right Floating Toast (full width on mobile, fixed width on larger screens) */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed z-50 top-3 left-3 right-3 sm:top-5 sm:left-auto sm:right-5 sm:w-full sm:max-w-sm md:max-w-md animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div
            className={`flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-md border ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/40 shadow-emerald-950/50'
                : 'bg-rose-950/95 text-rose-100 border-rose-500/40 shadow-rose-950/50'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 text-white">
                {toast.type === 'success' ? 'Success' : 'Notice / Error'}
              </h4>
              <p className="text-xs sm:text-[13px] leading-relaxed font-medium text-slate-200 break-words">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
                setToast(null);
              }}
              className="p-1.5 -m-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* my-auto centers vertically when there is room */}
      <div className="w-full max-w-[26rem] sm:max-w-md my-auto space-y-4 sm:space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#f87b1f] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#f87b1f]/20">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            FINASSET <span className="text-[#2376b8]">WEALTH</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium px-2">
            Administrative CMS &amp; Portfolio Control Center
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 min-[400px]:p-5 sm:p-7 md:p-8 shadow-2xl space-y-4 sm:space-y-6">
          {/* Header depending on mode */}
          <div className="border-b border-slate-800 pb-3 sm:pb-4">
            {mode === 'login' && (
              <>
                <h2 className={cardTitle}>
                  <Lock className="w-4 h-4 text-[#C7A76C] shrink-0" />
                  <span>Administrator Sign In</span>
                </h2>
                <p className={cardSubtitle}>
                  Authorized personnel only. Sessions are encrypted and monitored.
                </p>
              </>
            )}

            {mode === 'forgot-email' && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h2 className={cardTitle}>
                    <KeyRound className="w-4 h-4 text-[#C7A76C] shrink-0" />
                    <span className="truncate">Reset Password</span>
                  </h2>
                  <button type="button" onClick={() => setMode('login')} className={backBtn}>
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>
                <p className={cardSubtitle}>
                  Step 1 of 3: Enter your registered admin email to receive an OTP.
                </p>
              </>
            )}

            {mode === 'forgot-otp' && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h2 className={cardTitle}>
                    <ShieldCheck className="w-4 h-4 text-[#C7A76C] shrink-0" />
                    <span className="truncate">Verify Reset OTP</span>
                  </h2>
                  <button type="button" onClick={() => setMode('forgot-email')} className={backBtn}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden min-[380px]:inline">Change Email</span>
                    <span className="min-[380px]:hidden">Change</span>
                  </button>
                </div>
                <p className={cardSubtitle}>
                  Step 2 of 3: Enter the 6-digit OTP code sent to{' '}
                  <strong className="text-slate-200 break-all">{resetEmail}</strong>.
                </p>
              </>
            )}

            {mode === 'forgot-reset' && (
              <>
                <h2 className={cardTitle}>
                  <Lock className="w-4 h-4 text-[#C7A76C] shrink-0" />
                  <span>Create New Password</span>
                </h2>
                <p className={cardSubtitle}>
                  Step 3 of 3: Enter and confirm your new administrator password.
                </p>
              </>
            )}
          </div>

          {/* 1. LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className={labelClass}>
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    autoCapitalize="none"
                    required
                    placeholder="admin@finassetwealth.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputBase} pl-10 pr-4`}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email || '');
                      setMode('forgot-email');
                    }}
                    className="text-[11px] sm:text-xs text-[#C7A76C] hover:underline font-semibold py-1"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBase} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1 sm:pt-2">
                <button type="submit" disabled={loading} className={primaryBtn}>
                  <span>{loading ? 'Authenticating...' : 'Sign In to Admin CMS'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </form>
          )}

          {/* 2. FORGOT PASSWORD STEP 1: EMAIL ENTRY */}
          {mode === 'forgot-email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className={labelClass}>
                  Registered Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reset-email"
                    name="resetEmail"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    required
                    placeholder="admin@finassetwealth.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={`${inputBase} pl-10 pr-4`}
                  />
                </div>
              </div>

              <div className="pt-1 sm:pt-2">
                <button type="submit" disabled={loading} className={primaryBtn}>
                  <span className="text-center">
                    {loading ? 'Sending Verification OTP...' : 'Send 6-Digit OTP to Email'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD STEP 2: VERIFY OTP */}
          {mode === 'forgot-otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="reset-otp" className={labelClass}>
                  Enter 6-Digit OTP Code
                </label>
                <input
                  id="reset-otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={`${inputBase} px-2 sm:px-3 text-lg min-[400px]:text-xl sm:text-xl tracking-[0.3em] min-[400px]:tracking-[0.4em] sm:tracking-[0.5em] text-center font-mono`}
                />
              </div>

              <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-400">
                <span>Didn&apos;t receive email?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-[#C7A76C] hover:underline font-semibold flex items-center gap-1 py-1.5 disabled:opacity-60"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>{resending ? 'Resending...' : 'Resend OTP'}</span>
                </button>
              </div>

              <div className="pt-1 sm:pt-2">
                <button type="submit" disabled={loading || otp.length < 6} className={primaryBtn}>
                  <span>{loading ? 'Verifying OTP...' : 'Verify OTP Code'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </form>
          )}

          {/* 4. FORGOT PASSWORD STEP 3: NEW PASSWORD */}
          {mode === 'forgot-reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className={labelClass}>
                  New Password (min 8 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${inputBase} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className={labelClass}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputBase} pl-10 pr-4`}
                  />
                </div>
              </div>

              <div className="pt-1 sm:pt-2">
                <button type="submit" disabled={loading} className={primaryBtn}>
                  <span>{loading ? 'Updating Password...' : 'Save Password & Sign In'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back to Public Site */}
        <div className="text-center">
          <Link
            href="/"
            className="text-[11px] sm:text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center justify-center gap-1.5 min-h-[36px] px-2"
          >
            ← Return to Finasset Wealth Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}