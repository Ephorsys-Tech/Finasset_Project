'use client';

let listeners = [];
let toasts = [];

export const toast = {
  notify(message, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };
    toasts = [...toasts, newToast];
    listeners.forEach((listener) => listener(toasts));

    if (duration > 0) {
      setTimeout(() => {
        toast.remove(id);
      }, duration);
    }
    return id;
  },

  success(message, duration = 4000) {
    return toast.notify(message, 'success', duration);
  },

  error(message, duration = 5000) {
    return toast.notify(message, 'error', duration);
  },

  info(message, duration = 4000) {
    return toast.notify(message, 'info', duration);
  },

  remove(id) {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  },

  subscribe(listener) {
    listeners.push(listener);
    listener(toasts);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

export default toast;
