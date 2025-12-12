import { create } from 'zustand';

export interface Commodity {
    id: number;
    name: string;
    type: 'RAW' | 'PROCESSED';
}

interface CommodityState {
    selectedCommodityId: number | null; // Use ID for filtering
    selectedCommodityName: string; // For display
    commodities: Commodity[];

    // Actions
    setSelectedCommodity: (id: number, name: string) => void;
    setCommodities: (list: Commodity[]) => void;
    fetchCommodities: () => Promise<void>;
}

export const useCommodityStore = create<CommodityState>((set) => ({
    selectedCommodityId: null, // Will default to 1 (Tur whole) or 2 (Tur dal) on load
    selectedCommodityName: 'Tur Dal',
    commodities: [],

    setSelectedCommodity: (id, name) => set({ selectedCommodityId: id, selectedCommodityName: name }),

    setCommodities: (list) => set({ commodities: list }),

    fetchCommodities: async () => {
        try {
            const res = await fetch('/api/commodities');
            const data = await res.json();

            // Assuming data is array of commodities
            if (Array.isArray(data) && data.length > 0) {
                set({ commodities: data });
                // Set default to first one if none selected, or persist
                // But typically rely on Switcher setting it or URL param.
                // For initial load if empty:
                // set(state => ({ 
                //    selectedCommodityId: state.selectedCommodityId || data[0].id,
                //    selectedCommodityName: state.selectedCommodityName || data[0].name
                // }));
            }
        } catch (e) {
            console.error('Error fetching commodities:', e);
            // Fallback for offline dev
            set({
                commodities: [
                    { id: 1, name: 'Tur Whole', type: 'RAW' },
                    { id: 2, name: 'Tur Dal', type: 'PROCESSED' }
                ]
            });
        }
    }
}));
