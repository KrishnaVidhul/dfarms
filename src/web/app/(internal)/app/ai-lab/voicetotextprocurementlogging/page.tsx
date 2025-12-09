// @ts-nocheck
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorFallback() {
  return (
    <div className='p-4 text-red-400 border border-red-500 rounded'>
      <AlertTriangle />
      <h2 className='font-bold'>Creation Failed</h2>
      <p>Could not generate Voice-to-Text Procurement Logging due to API Error.</p>
    </div>
  );
}
