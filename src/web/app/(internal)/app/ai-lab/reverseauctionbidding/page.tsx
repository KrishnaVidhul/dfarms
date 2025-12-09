// @ts-nocheck
'use client';

import { useState } from 'react';
import { Activity, Circle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { clsx } from 'clsx';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  { name: 'Aug', uv: 2890, pv: 3800, amt: 2300 },
  { name: 'Sep', uv: 3490, pv: 4300, amt: 2100 },
  { name: 'Oct', uv: 2890, pv: 3800, amt: 2300 },
  { name: 'Nov', uv: 3490, pv: 4300, amt: 2100 },
  { name: 'Dec', uv: 2890, pv: 3800, amt: 2300 },
];

const BiddingItem = ({ item }) => {
  const [bidAmount, setBidAmount] = useState(0);

  const handleBid = () => {
    // handle bid logic
  };

  return (
    <div className={clsx('flex', 'items-center', 'justify-between', 'px-4', 'py-2', 'bg-gray-800', 'border-b', 'border-gray-700')}>
      <div className={clsx('flex', 'items-center')}>
        <Circle size={24} className={clsx('text-gray-500', 'mr-2')} />
        <span className={clsx('text-gray-200', 'text-sm')}>{item.name}</span>
      </div>
      <div className={clsx('flex', 'items-center')}>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className={clsx('w-20', 'h-8', 'px-2', 'py-1', 'bg-gray-700', 'text-gray-200', 'border', 'border-gray-600', 'rounded')}
        />
        <button
          onClick={handleBid}
          className={clsx('ml-2', 'px-4', 'py-1', 'bg-blue-600', 'text-gray-200', 'border', 'border-blue-700', 'rounded', 'hover:bg-blue-700')}
        >
          Bid
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className={clsx('flex', 'flex-col', 'h-screen', 'p-4', 'bg-gray-900')}>
      <h1 className={clsx('text-2xl', 'text-gray-200', 'mb-4')}>Reverse Auction Bidding</h1>
      <div className={clsx('flex', 'flex-col', 'mb-4')}>
        <LineChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        </LineChart>
      </div>
      <div className={clsx('flex', 'flex-col', 'space-y-2')}>
        {[1, 2, 3, 4, 5].map((item, index) => (
          <BiddingItem key={index} item={{ name: `Item ${index + 1}` }} />
        ))}
      </div>
    </div>
  );
}