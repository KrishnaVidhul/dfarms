import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white">
            <div className="bg-zinc-900 w-full max-w-md p-8 rounded-2xl border border-zinc-800 shadow-2xl">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-zinc-400 mb-8 text-sm">Sign in to your customer portal</p>

                <form className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="you@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors mt-4">
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    Don't have an account? {' '}
                    <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}
