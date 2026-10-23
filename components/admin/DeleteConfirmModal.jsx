'use client';

import { useEffect } from 'react';
import { Trash2, AlertTriangle, X, RefreshCw } from 'lucide-react';

/**
 * Reusable Admin Delete Confirmation Modal
 * Provides an accessible, high-contrast modal dialog to safely confirm destructive actions.
 *
 * @param {boolean} isOpen - Whether the modal dialog is visible
 * @param {() => void} onClose - Handler to dismiss the modal
 * @param {() => void} onConfirm - Handler to execute deletion
 * @param {string} [title] - Title heading
 * @param {string} [itemName] - Name of the item being removed
 * @param {string} [message] - Contextual warning message
 * @param {string} [warningDetails] - Optional warning banner (e.g. Cloudinary asset removal)
 * @param {string} [confirmText] - Label on the red confirm button
 * @param {string} [cancelText] - Label on cancel button
 * @param {boolean} [isDeleting] - Spinner loading state during API execution
 */
export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  itemName = '',
  message = 'Are you sure you want to delete this item? This action is permanent and cannot be undone.',
  warningDetails = '',
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  isDeleting = false,
}) {
  // Close on Escape key press and prevent page background scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => !isDeleting && onClose()}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => !isDeleting && onClose()}
          disabled={isDeleting}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="flex flex-col items-center text-center">
          {/* Animated Danger Badge */}
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-sm mb-4 ring-8 ring-rose-50/60">
            <Trash2 className="w-7 h-7 stroke-[2.2]" />
          </div>

          {/* Modal Title */}
          <h3 className="text-lg font-extrabold text-[#10243A] tracking-tight">
            {title}
          </h3>

          {/* Item Name highlight */}
          {itemName && (
            <div className="mt-2.5 px-3.5 py-1.5 bg-slate-100/90 rounded-xl max-w-full text-xs font-bold text-slate-800 line-clamp-2 border border-slate-200/70">
              &quot;{itemName}&quot;
            </div>
          )}

          {/* Message */}
          <p className="text-xs text-slate-500 mt-3 leading-relaxed max-w-xs">
            {message}
          </p>

          {/* Warning Banner (e.g. Cloudinary asset removal) */}
          {warningDetails && (
            <div className="mt-3.5 w-full p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-900 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{warningDetails}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>{confirmText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
