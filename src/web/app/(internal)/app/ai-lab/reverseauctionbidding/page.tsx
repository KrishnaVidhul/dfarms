// @ts-nocheck
import { ArrowDown, ArrowUp, Circle } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

'use client';

const data = [
  { name: 'Jan', price: 100 },
  { name: 'Feb', price: 120 },
  { name: 'Mar', price: 110 },
  { name: 'Apr', price: 130 },
  { name: 'May', price: 140 },
  { name: 'Jun', price: 150 },
  { name: 'Jul', price: 160 },
  { name: 'Aug', price: 170 },
  { name: 'Sep', price: 180 },
  { name: 'Oct', price: 190 },
  { name: 'Nov', price: 200 },
  { name: 'Dec', price: 210 },
];

const bidData = [
  { name: 'Bid 1', amount: 100 },
  { name: 'Bid 2', amount: 120 },
  { name: 'Bid 3', amount: 110 },
  { name: 'Bid 4', amount: 130 },
  { name: 'Bid 5', amount: 140 },
];

const Page = () => {
  const [currentBid, setCurrentBid] = useState(100);
  const [bidHistory, setBidHistory] = useState(bidData);

  const handleBid = () => {
    const newBid = { name: `Bid ${bidHistory.length + 1}`, amount: currentBid };
    setBidHistory([...bidHistory, newBid]);
  };

  return (
    <div className="h-screen w-full bg-gray-900 p-10">
      <h1 className="text-3xl font-bold text-white mb-5">Reverse Auction Bidding</h1>
      <div className="flex justify-between mb-10">
        <div className="w-1/2">
          <h2 className="text-2xl font-bold text-white mb-5">Current Bid: ${currentBid}</h2>
          <input
            type="number"
            value={currentBid}
            onChange={(e) => setCurrentBid(Number(e.target.value))}
            className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-800"
          />
          <button
            onClick={handleBid}
            className="w-full mt-5 p-2 pl-5 pr-5 bg-gray-600 text-gray-100 text-sm rounded-lg focus:border-4 border-gray-300"
          >
            Place Bid
          </button>
        </div>
        <div className="w-1/2">
          <h2 className="text-2xl font-bold text-white mb-5">Bid History</h2>
          <ul>
            {bidHistory.map((bid, index) => (
              <li key={index} className="flex justify-between mb-2">
                <span>{bid.name}</span>
                <span>${bid.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-5">Price Trend</h2>
        <LineChart width={500} height={300} data={data}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
        </LineChart>
      </div>
      <div className="flex justify-between mb-10">
        <div className="flex items-center">
          <ArrowDown size={20} className="text-green-500" />
          <span className="text-green-500 ml-2">Lowest Bid: ${Math.min(...bidHistory.map((bid) => bid.amount))}</span>
        </div>
        <div className="flex items-center">
          <ArrowUp size={20} className="text-red-500" />
          <span className="text-red-500 ml-2">Highest Bid: ${Math.max(...bidHistory.map((bid) => bid.amount))}</span>
        </div>
      </div>
      <div className="flex justify-between mb-10">
        <div className="flex items-center">
          <Circle size={20} className="text-yellow-500" />
          <span className="text-yellow-500 ml-2">Average Bid: ${bidHistory.reduce((acc, bid) => acc + bid.amount, 0) / bidHistory.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Page;