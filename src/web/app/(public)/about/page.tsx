
import { Award, ShieldCheck, Truck, Sprout } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12">

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Trust is our Primary Crop</h1>
                <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                    We don't just grow food; we engineer confidence. From seed to shelf, every step is monitored, verified, and certified.
                </p>
            </section>

            {/* Certifications - Quality Standards */}
            <section className="bg-zinc-900 py-20 border-y border-zinc-800 mb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start justify-between mb-12">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Quality Standards
                        </h2>
                        <div className="max-w-md text-zinc-400 mt-4 md:mt-0">
                            Our rigorous "Zero-Compromise" policy ensures that only the best produce leaves our facilities.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Award, title: "ISO 22000", desc: "Food Safety Management" },
                            { icon: ShieldCheck, title: "Global G.A.P.", desc: "Good Agricultural Practice" },
                            { icon: Sprout, title: "Organic Certified", desc: "100% Chemical Free" },
                            { icon: Truck, title: "Cold Chain", desc: "Temperature Controlled Logistics" }
                        ].map((cert, idx) => (
                            <div key={idx} className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                                <cert.icon className="text-emerald-500 mb-4" size={32} />
                                <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                                <p className="text-sm text-zinc-500">{cert.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="max-w-7xl mx-auto px-6 mb-20">
                <h2 className="text-3xl font-bold mb-12">Field Operations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
                    {/* Masonry-style simulated with grid spans */}
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center relative group overflow-hidden md:col-span-2 md:row-span-2">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors z-10 font-bold">Drone Surveillance</span>
                    </div>
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center relative group overflow-hidden">
                        <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors font-bold">Hydroponics Lab</span>
                    </div>
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center relative group overflow-hidden md:row-span-2">
                        <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors font-bold">Vertical Stacking</span>
                    </div>
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center relative group overflow-hidden">
                        <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors font-bold">Soil Analysis</span>
                    </div>
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center relative group overflow-hidden md:col-span-2">
                        <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors font-bold">Packaging Facility</span>
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="border-t border-zinc-900 pt-20 pb-12 text-center">
                <p className="text-zinc-600 text-sm font-semibold uppercase tracking-widest mb-8">Trusted By</p>
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {['BigBasket', 'Reliance Fresh', 'Costco', 'Whole Foods'].map((brand, i) => (
                        <span key={i} className="text-2xl font-bold text-zinc-500">{brand}</span>
                    ))}
                </div>
            </section>
        </div>
    );
}
