'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Loader2, Lock, RefreshCw, ShieldCheck } from 'lucide-react';
import { useEnquiryStore } from '@/store/useEnquiryStore';
import { useServiceStore } from '@/store/useServiceStore';

const DEFAULT_SERVICE_OPTIONS = [
  { value: 'Mutual Funds & SIP', label: 'Mutual Funds & SIP' },
  { value: 'Comprehensive Financial Planning', label: 'Comprehensive Financial Planning' },
  { value: 'Life & Health Insurance', label: 'Life & Health Insurance' },
  { value: 'NRI Wealth Advisory', label: 'NRI Wealth Advisory' },
  { value: 'Real Estate Advisory', label: 'Real Estate Advisory' },
  { value: 'Fixed Deposits & Bonds', label: 'Fixed Deposits & Bonds' },
  { value: 'Portfolio Management (PMS)', label: 'Portfolio Management (PMS)' },
];

const TIME_OPTIONS = [
  { value: 'Anytime', label: 'Anytime during business hours' },
  { value: 'Morning (10:00 AM - 1:00 PM)', label: 'Morning (10 AM - 1 PM)' },
  { value: 'Afternoon (1:00 PM - 4:00 PM)', label: 'Afternoon (1 PM - 4 PM)' },
  { value: 'Evening (4:00 PM - 7:00 PM)', label: 'Evening (4 PM - 7 PM)' },
];

const INITIAL_FORM = {
  name: '',
  phone: '',
  serviceOfInterest: '',
  preferredTime: TIME_OPTIONS[0].value,
  message: '',
};

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2376b8] focus:ring-4 focus:ring-[#2376b8]/15';

/* ---------------- CAPTCHA helpers ---------------- */

const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid confusion
const CAPTCHA_LENGTH = 5;
const CAPTCHA_W = 170;
const CAPTCHA_H = 54;

function generateCode() {
  const values = new Uint32Array(CAPTCHA_LENGTH);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => CAPTCHA_CHARS[v % CAPTCHA_CHARS.length]).join('');
}

const rand = (min, max) => Math.random() * (max - min) + min;

function drawCaptcha(canvas, code) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = CAPTCHA_W * dpr;
  canvas.height = CAPTCHA_H * dpr;
  canvas.style.width = `${CAPTCHA_W}px`;
  canvas.style.height = `${CAPTCHA_H}px`;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Background
  const bg = ctx.createLinearGradient(0, 0, CAPTCHA_W, CAPTCHA_H);
  bg.addColorStop(0, '#eef5fb');
  bg.addColorStop(1, '#f6f9f1');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CAPTCHA_W, CAPTCHA_H);

  // Noise lines
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(35,118,184,${rand(0.15, 0.4)})`;
    ctx.lineWidth = rand(1, 2);
    ctx.beginPath();
    ctx.moveTo(rand(0, CAPTCHA_W), rand(0, CAPTCHA_H));
    ctx.bezierCurveTo(
      rand(0, CAPTCHA_W), rand(0, CAPTCHA_H),
      rand(0, CAPTCHA_W), rand(0, CAPTCHA_H),
      rand(0, CAPTCHA_W), rand(0, CAPTCHA_H)
    );
    ctx.stroke();
  }

  // Characters
  const step = CAPTCHA_W / (code.length + 1);
  const colors = ['#0f2b44', '#2376b8', '#5e8424', '#d9620b'];
  [...code].forEach((ch, i) => {
    ctx.save();
    ctx.translate(step * (i + 1) + rand(-3, 3), CAPTCHA_H / 2 + rand(-4, 4));
    ctx.rotate(rand(-0.4, 0.4));
    ctx.font = `bold ${Math.round(rand(26, 32))}px ui-monospace, Menlo, Consolas, monospace`;
    ctx.fillStyle = colors[i % colors.length];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  // Noise dots
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(15,43,68,${rand(0.15, 0.45)})`;
    ctx.beginPath();
    ctx.arc(rand(0, CAPTCHA_W), rand(0, CAPTCHA_H), rand(0.6, 1.4), 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Captcha: image + refresh + input.
 * Reports whether the typed answer is correct via onValidChange(boolean).
 * Changing `resetKey` generates a new code.
 */
function Captcha({ resetKey, onValidChange }) {
  const id = useId();
  const canvasRef = useRef(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const refresh = useCallback(() => {
    setCode(generateCode());
    setInput('');
    onValidChange(false);
  }, [onValidChange]);

  // New code on mount and whenever the parent asks for a reset
  useEffect(() => {
    refresh();
  }, [resetKey, refresh]);

  useEffect(() => {
    if (code) drawCaptcha(canvasRef.current, code);
  }, [code]);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInput(value);
    onValidChange(code !== '' && value.trim() === code);
  };

  const isValid = code !== '' && input.trim() === code;
  const isWrong = input.length >= CAPTCHA_LENGTH && !isValid;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        Verification <span className="text-[#f87b1f]">*</span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-1.5">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Captcha image. Type the characters you see."
            className="select-none rounded-lg"
            style={{ width: CAPTCHA_W, height: CAPTCHA_H }}
          />
          <button
            type="button"
            onClick={refresh}
            title="Get a new code"
            aria-label="Refresh captcha"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#2376b8] active:rotate-180"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="relative min-w-[160px] flex-1">
          <input
            id={id}
            type="text"
            value={input}
            onChange={handleChange}
            maxLength={CAPTCHA_LENGTH}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="Type the code"
            aria-invalid={isWrong}
            className={`${inputClass} pr-10 font-mono tracking-[0.25em] uppercase placeholder:font-sans placeholder:normal-case placeholder:tracking-normal ${
              isValid
                ? 'border-[#89b441] focus:border-[#89b441] focus:ring-[#89b441]/20'
                : isWrong
                ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20'
                : ''
            }`}
          />
          {isValid && (
            <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#89b441]" />
          )}
        </div>
      </div>

      {isWrong && (
        <p className="mt-1.5 text-xs text-rose-600">Code does not match. Try again or refresh.</p>
      )}
    </div>
  );
}

/* ---------------- Main component ---------------- */

function Field({ label, required, optional, children }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-[#f87b1f]"> *</span>}
        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>
      {children(id)}
    </div>
  );
}

/**
 * Callback Form Component
 * Self-contained "Request a Call Back" section with captcha.
 * Connects Area of interest directly with services managed by the Admin.
 * Usage: <CallbackForm initialServices={services} />
 */
export default function CallbackForm({ initialServices = [] }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [captchaOk, setCaptchaOk] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);

  const {
    isSubmitting,
    submitSuccess,
    submitError,
    trackingNumber,
    submitCallback,
    setSubmitError,
    resetStatus,
  } = useEnquiryStore();

  const { services: storeServices, fetchServices, setServices } = useServiceStore();

  // Load published services configured by the Admin via Axios
  useEffect(() => {
    if (Array.isArray(initialServices) && initialServices.length > 0) {
      setServices(initialServices);
    } else {
      fetchServices();
    }
  }, [initialServices, setServices, fetchServices]);

  const currentServices =
    storeServices && storeServices.length > 0
      ? storeServices
      : Array.isArray(initialServices) && initialServices.length > 0
      ? initialServices
      : [];

  // Map admin services to dropdown options with graceful fallback
  const serviceOptions = useMemo(() => {
    if (currentServices.length > 0) {
      return currentServices.map((s) => ({
        value: s.name || s.title,
        label: s.name || s.title,
      }));
    }
    return DEFAULT_SERVICE_OPTIONS;
  }, [currentServices]);

  // Keep form.serviceOfInterest in sync with available options
  useEffect(() => {
    if (serviceOptions.length > 0) {
      setForm((prev) => {
        const exists = serviceOptions.some((o) => o.value === prev.serviceOfInterest);
        if (!exists || !prev.serviceOfInterest) {
          return { ...prev, serviceOfInterest: serviceOptions[0].value };
        }
        return prev;
      });
    }
  }, [serviceOptions]);

  // Reset status on unmount so form starts clean
  useEffect(() => {
    return () => resetStatus();
  }, [resetStatus]);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!captchaOk) {
      setSubmitError('Please enter the correct verification code.');
      return;
    }

    if (!form.name || form.name.trim().length < 2) {
      setSubmitError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (/\d/.test(form.name)) {
      setSubmitError('Full name cannot contain numbers.');
      return;
    }

    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setSubmitError('Please enter a valid phone number (at least 10 digits).');
      return;
    }

    try {
      const res = await submitCallback({
        name: form.name,
        phone: form.phone,
        serviceOfInterest: form.serviceOfInterest || serviceOptions[0]?.value || 'General Wealth Advisory',
        preferredTime: form.preferredTime,
        message: form.message,
        sourcePage: 'Homepage Call Back Form',
      });

      if (res.success) {
        setForm({
          ...INITIAL_FORM,
          serviceOfInterest: serviceOptions[0]?.value || '',
        });
      }
    } finally {
      setCaptchaKey((k) => k + 1); // refresh captcha after submission attempt
    }
  };

  const handleReset = () => {
    resetStatus();
    setForm({
      ...INITIAL_FORM,
      serviceOfInterest: serviceOptions[0]?.value || '',
    });
    setCaptchaKey((k) => k + 1);
  };

  return (
    <section id="contact" className="scroll-mt-20 border-t border-slate-200/80 bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full border border-[#2376b8]/20 bg-[#2376b8]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2376b8]">
            Free Consultation
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Request a Call Back
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
            Share a few details and our wealth advisors in Bhubaneswar will call you at your
            preferred time.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {submitSuccess ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#89b441]/15">
                <CheckCircle2 className="h-9 w-9 text-[#89b441]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Request received</h3>
              {trackingNumber && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#2376b8]/20 bg-[#2376b8]/5 px-3 py-1 text-xs font-semibold text-[#2376b8]">
                  <span>Reference ID:</span>
                  <span className="font-mono">{trackingNumber}</span>
                </div>
              )}
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                Thank you! Our advisory team will contact you at your preferred time.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#2376b8] transition hover:bg-[#2376b8]/5"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700"
                >
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full name" required>
                  {(id) => (
                    <input
                      id={id}
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Ramesh Mohanty"
                      value={form.name}
                      onChange={update('name')}
                      className={inputClass}
                    />
                  )}
                </Field>

                <Field label="Phone number" required>
                  {(id) => (
                    <input
                      id={id}
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 94370 12345"
                      value={form.phone}
                      onChange={update('phone')}
                      className={inputClass}
                    />
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Area of interest">
                  {(id) => (
                    <select
                      id={id}
                      value={form.serviceOfInterest || (serviceOptions[0]?.value ?? '')}
                      onChange={update('serviceOfInterest')}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {serviceOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>

                <Field label="Best time to call">
                  {(id) => (
                    <select
                      id={id}
                      value={form.preferredTime}
                      onChange={update('preferredTime')}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {TIME_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>

              <Field label="Message" optional>
                {(id) => (
                  <textarea
                    id={id}
                    rows={3}
                    placeholder="Tell us about your goals or question..."
                    value={form.message}
                    onChange={update('message')}
                    className={`${inputClass} resize-none`}
                  />
                )}
              </Field>

              <Captcha resetKey={captchaKey} onValidChange={setCaptchaOk} />

              <button
                type="submit"
                disabled={isSubmitting || !captchaOk}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f87b1f] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d9620b] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>Request Call Back</span>
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                <Lock className="h-3.5 w-3.5" />
                Your details are kept confidential and never shared.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}