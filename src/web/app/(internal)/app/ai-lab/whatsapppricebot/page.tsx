// @ts-nocheck
import { Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Page() {
  'use client';

  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    setTotal(price * quantity);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 rounded-lg bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">WhatsApp Price Bot</h2>
        <Activity className="text-gray-500" size={24} />
      </div>
      <form>
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="price">
            Price per unit
          </label>
          <input
            className={clsx(
              'block',
              'w-full',
              'p-2',
              'text-gray-700',
              'bg-gray-600',
              'border',
              'border-gray-500',
              'rounded',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-gray-400'
            )}
            type="number"
            id="price"
            value={price}
            onChange={handlePriceChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            className={clsx(
              'block',
              'w-full',
              'p-2',
              'text-gray-700',
              'bg-gray-600',
              'border',
              'border-gray-500',
              'rounded',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-gray-400'
            )}
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <button
          className={clsx(
            'bg-gray-500',
            'hover:bg-gray-700',
            'text-white',
            'font-bold',
            'py-2',
            'px-4',
            'rounded',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-gray-400'
          )}
          type="button"
          onClick={calculateTotal}
        >
          Calculate Total
        </button>
      </form>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-white">Total</h3>
        <p className="text-gray-200">{total}</p>
      </div>
    </div>
  );
}