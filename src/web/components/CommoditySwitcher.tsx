
'use client';

import { useEffect, useState } from 'react';
import { useCommodityStore } from '../store/commodityStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Wheat } from 'lucide-react';

export default function CommoditySwitcher() {
    const { selectedCommodityName, commodities, setSelectedCommodity, fetchCommodities } = useCommodityStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (commodities.length === 0) {
            fetchCommodities();
        }
    }, []);

    useEffect(() => {
        // Sync from URL if present
        const cid = searchParams.get('commodityId');
        if (cid && commodities.length > 0) {
            const matched = commodities.find(c => c.id === Number(cid));
            if (matched && matched.name !== selectedCommodityName) {
                setSelectedCommodity(matched.id, matched.name);
            }
        }
    }, [commodities, searchParams, selectedCommodityName, setSelectedCommodity]);

    const handleSelect = (id: number, name: string) => {
        setSelectedCommodity(id, name);
        router.push(`?commodityId=${id}`); // Sync to URL for Server Components
        router.refresh(); // Force Server Component Re-fetch
    };

    const [isOpen, setIsOpen] = useState(false);

    // Close logic: Click outside handler could be added, or simple onBlur
    // Using simple toggle for now.

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow item click
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-sm text-gray-200"
            >
                <Wheat className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">{selectedCommodityName || 'Select Commodity'}</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                    <div className="p-1">
                        {commodities.map((c) => (
                            <button
                                key={c.id}
                                onMouseDown={() => handleSelect(c.id, c.name)} // onMouseDown fires before onBlur
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors flex justify-between items-center"
                            >
                                <span>{c.name}</span>
                                <span className="text-[10px] uppercase bg-gray-900 px-1.5 py-0.5 rounded text-gray-500">{c.type}</span>
                            </button>
                        ))}
                        {commodities.length === 0 && (
                            <div className="px-3 py-2 text-xs text-gray-500 text-center">Loading...</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
