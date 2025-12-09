'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InventorySyncWrapper() {
    const router = useRouter();
    const [lastSync, setLastSync] = useState<string>(''); // Initialize as empty string to avoid hydration mismatch

    useEffect(() => {
        // Set initial time on client mount
        setLastSync(new Date().toLocaleTimeString());

        const interval = setInterval(() => {
            router.refresh(); // Tells Server Components to re-fetch data
            setLastSync(new Date().toLocaleTimeString());
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [router]);

    // Don't render date until client-side hydration is complete
    if (!lastSync) return (
        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1 border border-gray-800 rounded px-2 py-1 bg-gray-900/50 opacity-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            Syncing...
        </div>
    );

    return (
        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1 border border-gray-800 rounded px-2 py-1 bg-gray-900/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Sync: {lastSync}
        </div>
    );
}
