'use client';

import React from 'react';
import ToastContainer from '@/components/ui/ToastContainer';

export default function Providers({ children }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
