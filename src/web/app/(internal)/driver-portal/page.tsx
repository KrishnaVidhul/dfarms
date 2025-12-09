import { Truck, MapPin, Camera, Package } from 'lucide-react';

export default function DriverPortal() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            {/* Header */}
            <header className="flex justify-between items-center mb-6 pt-4">
                <div>
                    <h1 className="text-2xl font-bold">Good Morning, Suresh</h1>
                    <p className="text-gray-400 text-sm">Vehicle: MH-14-GH-2029</p>
                </div>
                <div className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-800">
                    ONLINE
                </div>
            </header>

            {/* Primary Action */}
            <button className="w-full bg-emerald-600 active:bg-emerald-700 h-32 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-emerald-900/40 mb-8 transition-transform active:scale-95">
                <Truck size={48} className="mb-2" />
                <span className="text-xl font-bold">START TRIP</span>
                <span className="text-sm opacity-80">Route #402: Akola to Mumbai</span>
            </button>

            {/* Current Delivery */}
            <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Current Stop</h3>
                <div className="flex items-start gap-4 mb-6">
                    <div className="mt-1 bg-blue-900/30 p-2 rounded-lg text-blue-400">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div className="text-lg font-bold">BigBasket Hub, Vashi</div>
                        <div className="text-gray-400 text-sm">Sector 19, Navi Mumbai</div>
                        <div className="mt-2 text-yellow-400 text-sm font-semibold">ETA: 45 mins</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-gray-700 hover:bg-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                        <Package size={16} /> View Order
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                        <Camera size={16} /> Upload POD
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-xs uppercase font-bold">Completed</div>
                    <div className="text-2xl font-bold mt-1">12</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-xs uppercase font-bold">Fuel (L)</div>
                    <div className="text-2xl font-bold mt-1">45.2</div>
                </div>
            </div>
        </div>
    );
}
