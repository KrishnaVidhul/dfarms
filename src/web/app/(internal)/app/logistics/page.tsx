import Link from 'next/link';

export default function LogisticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8 border-b border-[#1F242C] pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-orange-500">Fleet & Logistics</h1>
                    <p className="text-zinc-400 mt-1">Real-time Vehicle Tracking & Route Optimization</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg text-center py-20">
                    <h2 className="text-xl font-bold text-gray-500 mb-2">Live Map View</h2>
                    <p className="text-gray-600">Map integration pending (waiting for agents)</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4">Active Deliveries</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-black/40 rounded border border-gray-800 flex justify-between">
                            <div>
                                <h3 className="font-bold text-white">Truck KA-01-HH-1234</h3>
                                <p className="text-xs text-gray-400">Route: Mandi -&gt; Warehouse A</p>
                            </div>
                            <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded h-fit">In Transit</span>
                        </div>
                        <div className="p-4 bg-black/40 rounded border border-gray-800 flex justify-between">
                            <div>
                                <h3 className="font-bold text-white">Truck KA-04-MM-9988</h3>
                                <p className="text-xs text-gray-400">Route: Farm 22 -&gt; Distribution</p>
                            </div>
                            <span className="text-xs font-bold text-orange-400 bg-orange-900/20 px-2 py-1 rounded h-fit">Loading</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
