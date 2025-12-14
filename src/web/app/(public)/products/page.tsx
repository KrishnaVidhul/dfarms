'use client';

// REMOVED: import { pool } from '@/lib/db';
// Client components cannot import server modules.

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false); // Fix hydration mismatch
    const { addItem, items, isOpen, setOpen } = useCartStore();

    useEffect(() => {
        setMounted(true);
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/commodities');
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                     setProducts(data);
                     setLoading(false);
                     return;
                }
            }

            // Fallback Data
            setProducts([
                { id: '1', name: 'Wheat (Sharbati)', category: 'Grain', quantity: 5000, unit: 'kg' },
                { id: '2', name: 'Rice (Basmati)', category: 'Grain', quantity: 3000, unit: 'kg' },
                { id: '3', name: 'Tur Dal', category: 'Pulse', quantity: 1500, unit: 'kg' },
                { id: '4', name: 'Mustard Oil', category: 'Oil', quantity: 800, unit: 'L' },
                { id: '5', name: 'Cotton', category: 'Fiber', quantity: 2000, unit: 'bale' },
                { id: '6', name: 'Soybean', category: 'Legume', quantity: 4500, unit: 'kg' },
            ]);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center relative">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
                        Premium Produce Catalog
                    </h1>
                    <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                        Sourced directly from our sustainable farms. Fresh, organic, and quality-tested daily.
                    </p>

                    {/* Cart Trigger */}
                    <div className="absolute right-0 top-0">
                        <Button
                            variant="outline"
                            className="relative"
                            onClick={() => setOpen(true)}
                        >
                            <ShoppingCart size={20} />
                            {mounted && items.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {items.length}
                                </span>
                            )}
                        </Button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((item, idx) => (
                            <Card key={idx} className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 transition-colors group">
                                <div className="h-48 bg-zinc-800/50 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60"></div>
                                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                        {['🌾', '🍚', '🥣', '🛢️', '🧶', '🌱'][idx % 6] || '📦'}
                                    </span>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <CardTitle className="text-xl text-zinc-100">{item.name}</CardTitle>
                                        <Badge variant="outline" className="text-emerald-400 border-emerald-900/50 bg-emerald-900/10">
                                            {item.category}
                                        </Badge>
                                    </div>
                                    <p className="text-zinc-400 text-sm mb-6">
                                        Available: <span className="text-zinc-200 font-medium">{item.quantity} {item.unit}</span>
                                    </p>
                                    <Button
                                        className="w-full bg-zinc-100 hover:bg-white text-zinc-900"
                                        onClick={() => addItem({
                                            id: item.id || idx.toString(),
                                            name: item.name,
                                            quantity: 100, // Default MOQ
                                            unit: item.unit
                                        })}
                                    >
                                        Request Quote
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {mounted && <CartDrawer />}
        </div>
    );
}

function CartDrawer() {
    const { items, isOpen, setOpen, removeItem, clearCart } = useCartStore();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Guest details
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/store/rfq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    customerDetails: { name, email, phone }
                })
            });

            if (res.ok) {
                setSuccess(true);
                clearCart();
                setTimeout(() => {
                    setOpen(false);
                    setSuccess(false);
                }, 3000);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}></div>
            <div className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Quote Request</h2>
                    <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button>
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                            <Check size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Request Sent!</h3>
                        <p className="text-zinc-400">Our sales team will contact you shortly with a custom quote.</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                        <ShoppingCart size={48} className="mb-4 opacity-50" />
                        <p>Your basket is empty</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                                    <div>
                                        <p className="font-medium text-zinc-200">{item.name}</p>
                                        <p className="text-sm text-zinc-500">Qty: {item.quantity} {item.unit}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300">
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t border-zinc-800 pt-6">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Contact Details</h3>
                            <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-950 border-zinc-800" />
                            <Input placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="bg-zinc-950 border-zinc-800" />
                            <Input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="bg-zinc-950 border-zinc-800" />

                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Submit Request'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
