'use client';

import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Check if using username or email in DB. Route expects 'username'. 
            // Assuming email == username for this system based on seeding.
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Redirect based on role
            // Use window.location.href to force hard reload and ensure cookies are sent
            if (data.role === 'admin' || data.role === 'super_admin') {
                window.location.href = '/admin';
            } else if (data.role === 'driver') {
                window.location.href = '/driver-portal';
            } else if (data.role === 'staff') {
                window.location.href = '/staff-portal';
            } else {
                window.location.href = '/app';
            }

            // router.refresh() not needed with hard redirect

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white">
            <div className="bg-zinc-900 w-full max-w-md p-8 rounded-2xl border border-zinc-800 shadow-2xl">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-zinc-400 mb-8 text-sm">Sign in to your customer portal</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors mt-4 flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
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

