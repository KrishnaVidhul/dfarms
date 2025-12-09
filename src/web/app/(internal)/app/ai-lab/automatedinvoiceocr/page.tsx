// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Activity, Box, Circle, User } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Page() {
  const [invoiceImage, setInvoiceImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInvoiceImage(URL.createObjectURL(file));
      performOCR(file);
    }
  };

  const performOCR = async (file) => {
    // Mock OCR result
    setOcrResult(`Mock OCR Result for ${file.name}`);
  };

  return (
    <div className="p-4">
      <h1 className={twMerge(
        'text-xl font-bold',
        'dark:text-white'
      )}>Automated Invoice OCR</h1>
      <div className="mt-6 flex items-center justify-between">
        <label htmlFor="invoiceFile" className="flex items-center gap-2 cursor-pointer">
          {invoiceImage ? (
            <img src={invoiceImage} alt="Invoice" className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <>
              <Box />
              <span>Upload Invoice</span>
            </>
          )}
        </label>
        <input id="invoiceFile" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
        {ocrResult && (
          <button onClick={() => setOcrResult('')} className="px-4 py-2 bg-red-500 text-white rounded-lg">
            Clear Result
          </button>
        )}
      </div>
      {ocrResult && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-zinc-700 rounded-lg shadow-md">
          <h2 className={twMerge(
            'text-lg font-semibold',
            'dark:text-white'
          )}>OCR Result</h2>
          <pre className="mt-2 whitespace-pre-wrap">{ocrResult}</pre>
        </div>
      )}
    </div>
  );
}