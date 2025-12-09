'use client';

import { useRouter } from 'next/navigation';

export default function RefreshButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.refresh()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
            Refresh Inventory
        </button>
    );
}
