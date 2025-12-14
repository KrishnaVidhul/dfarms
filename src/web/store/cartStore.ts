import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Unique ID (e.g. commodity_id)
    name: string;
    quantity: number;
    unit: string;
    price?: number; // Optional reference price
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) => set((state) => {
                const existing = state.items.find((i) => i.id === newItem.id);
                if (existing) {
                    return {
                        items: state.items.map((i) =>
                            i.id === newItem.id
                                ? { ...i, quantity: i.quantity + newItem.quantity }
                                : i
                        ),
                        isOpen: true // Auto open cart on add
                    };
                }
                return { items: [...state.items, newItem], isOpen: true };
            }),

            removeItem: (id) => set((state) => ({
                items: state.items.filter((i) => i.id !== id)
            })),

            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map((i) =>
                    i.id === id ? { ...i, quantity } : i
                )
            })),

            clearCart: () => set({ items: [] }),

            setOpen: (open) => set({ isOpen: open }),
        }),
        {
            name: 'dfarms-cart-storage',
        }
    )
);
