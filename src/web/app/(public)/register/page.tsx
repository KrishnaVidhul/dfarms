import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white">
            <div className="bg-zinc-900 w-full max-w-md p-8 rounded-2xl border border-zinc-800 shadow-2xl">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <h1 className="text-2xl font-bold mb-2">Join D-Farms</h1>
                <p className="text-zinc-400 mb-8 text-sm">Create an account to track orders & quality reports</p>

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">First Name</label>
                            <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Last Name</label>
                            <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Email</label>
                        <input type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Company (Optional)</label>
                        <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors mt-4">
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    Already have an account? {' '}
                    <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
