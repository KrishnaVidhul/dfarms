import { Pool } from 'pg';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function getInventory() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT item_name, quantity, unit, category FROM inventory ORDER BY item_name ASC');
        client.release();
        return res.rows;
    } catch (err) {
        console.error('DB Error:', err);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getInventory();

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
                        Premium Produce Catalog
                    </h1>
                    <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                        Sourced directly from our sustainable farms. Fresh, organic, and quality-tested daily.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.length > 0 ? (
                        products.map((item, idx) => (
                            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors group">
                                <div className="h-48 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                                    {/* Placeholder for image - in real app would match item name */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60"></div>
                                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                        {['🍎', '🥕', '🥔', '🌽', '🍅', '🥦'][idx % 6]}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold text-zinc-100">{item.item_name}</h3>
                                        <span className="bg-emerald-900/30 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-900/50 uppercase tracking-wide">
                                            {item.category}
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 text-sm mb-6">
                                        Available: <span className="text-zinc-200 font-medium">{item.quantity} {item.unit}</span>
                                    </p>
                                    <button className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-3 rounded-lg transition-colors">
                                        Request Quote
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-zinc-500">
                            Our catalog is currently being updated. Please check back soon.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
