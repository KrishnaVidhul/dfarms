// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { clsx } from 'clsx';

const mockBiddingItems = [
    { id: 1, name: 'Item 1', currentPrice: 100, highestBid: 0, bids: [] },
    { id: 2, name: 'Item 2', currentPrice: 200, highestBid: 0, bids: [] },
    { id: 3, name: 'Item 3', currentPrice: 300, highestBid: 0, bids: [] },
];

const mockChartData = [
    { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 300, pv: 1397, amt: 2210 },
    { name: 'Mar', uv: 200, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 278, pv: 3908, amt: 2000 },
    { name: 'May', uv: 189, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 239, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 349, pv: 4300, amt: 2100 },
];

const BiddingItem = ({ item, handleBid }) => {
    const [bidAmount, setBidAmount] = useState('');

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value)) {
            setBidAmount(value);
        } else {
            setBidAmount('');
        }
    };

    const handleBidSubmit = () => {
        if (bidAmount !== '') {
            handleBid(item, parseInt(bidAmount));
            setBidAmount('');
        }
    };

    return (
        <div className="flex justify-between p-4 border border-gray-600 rounded">
            <div className="flex items-center">
                <Activity size={24} className="mr-2 text-gray-400" />
                <span className="text-lg font-medium">{item.name}</span>
            </div>
            <div className="flex items-center">
                <input
                    type="text"
                    value={bidAmount}
                    onChange={handleInputChange}
                    placeholder="Enter bid amount"
                    className="w-32 p-2 pl-10 text-sm text-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
                <button
                    onClick={handleBidSubmit}
                    className="ml-4 px-4 py-2 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                    Bid
                </button>
                <span className="ml-4 text-lg font-medium">Current Price: {item.currentPrice}</span>
                <span className="ml-4 text-lg font-medium">Highest Bid: {item.highestBid}</span>
            </div>
        </div>
    );
};

const Page = () => {
    const [biddingItems, setBiddingItems] = useState(mockBiddingItems);

    const handleBid = (item, bidAmount) => {
        const updatedBiddingItems = [...biddingItems];
        const currentItem = updatedBiddingItems.find((i) => i.id === item.id);
        if (currentItem) {
            if (bidAmount > currentItem.highestBid) {
                currentItem.highestBid = bidAmount;
                currentItem.bids.push(bidAmount);
            }
        }
        setBiddingItems(updatedBiddingItems);
    };

    return (
        <div className="p-4 bg-gray-800">
            <h1 className="text-2xl font-bold text-white">Reverse Auction Bidding</h1>
            {biddingItems.map((item) => (
                <BiddingItem key={item.id} item={item} handleBid={handleBid} />
            ))}
            <LineChart width={800} height={400} data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
        </div>
    );
};

export default Page;