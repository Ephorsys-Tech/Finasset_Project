'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/store/toastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((items) => {
      setToasts([...items]);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            item.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/60'
              : item.type === 'error'
              ? 'bg-rose-950/90 text-rose-100 border-rose-800/60'
              : 'bg-brand-navy/95 text-white border-brand-gold/30'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {item.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {item.type === 'info' && <Info className="w-5 h-5 text-brand-gold" />}
          </div>

          <div className="flex-1 text-sm font-medium leading-relaxed">
            {item.message}
          </div>

          <button
            onClick={() => toast.remove(item.id)}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
