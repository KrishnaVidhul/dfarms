import Link from 'next/link';

export default function LandingPage() {
    return (
        <main className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
            {/* Nav */}
            <nav className="flex justify-between items-center p-6 border-b border-gray-800">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                    D Farms
                </div>
                <Link
                    href="/login"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                    Login
                </Link>
            </nav>

            {/* Hero */}
            <section className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                    Premium Pulses<br />
                    <span className="text-teal-400">For Global Wholesale</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mb-10">
                    Direct from the heart of Maharashtra to your warehouse.
                    Managed by AI-driven logistics and market intelligence.
                </p>
                <div className="flex gap-4">
                    <Link
                        href="/login"
                        className="bg-white text-gray-950 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors"
                    >
                        Get Started
                    </Link>
                    <button className="border border-gray-700 text-gray-300 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors">
                        Contact Sales
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="p-6 text-center text-gray-600 text-sm border-t border-gray-800">
                &copy; 2025 D Farms. Agentic Logistics Powered.
            </footer>
        </main>
    );
}
