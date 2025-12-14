'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye } from 'lucide-react';

// NOTE: In a real app, this data fetching should happen on the server or via a useSWR hook.
// For simplicity in this demo, we fetch in useEffect.

interface Order {
    id: string;
    order_number: string;
    customer_details: { name: string; email: string; phone: string };
    status: string;
    created_at: string;
    item_count: number;
}

export default function SalesDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Need to create this endpoint
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // We'll reuse the same /api/store/rfq endpoint but with GET and admin checks
            // Or create a new one. For now let's assume we create /api/admin/orders
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white">Sales & RFQs</h1>
                    <p className="text-zinc-400 text-sm mt-1">Manage incoming quote requests and orders</p>
                </div>
                <Button onClick={fetchOrders} variant="outline" size="sm">Refresh</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Pending RFQs</p>
                        <p className="text-2xl font-bold text-white mt-2">
                            {orders.filter(o => o.status === 'PENDING').length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Revenue (Est)</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-2">₹0.00</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-base text-zinc-200">Recent Orders</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="text-zinc-500">Order ID</TableHead>
                                <TableHead className="text-zinc-500">Customer</TableHead>
                                <TableHead className="text-zinc-500">Date</TableHead>
                                <TableHead className="text-zinc-500">Items</TableHead>
                                <TableHead className="text-zinc-500">Status</TableHead>
                                <TableHead className="text-zinc-500 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin h-4 w-4" /> Loading orders...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-800/30">
                                        <TableCell className="font-mono text-zinc-300">{order.order_number}</TableCell>
                                        <TableCell className="text-zinc-400">
                                            <div className="flex flex-col">
                                                <span className="text-zinc-200">{order.customer_details?.name || 'Guest'}</span>
                                                <span className="text-xs">{order.customer_details?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-zinc-400">{order.item_count}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'PENDING' ? 'secondary' : 'success'}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost">
                                                <Eye size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
