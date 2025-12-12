import Link from 'next/link';
import { Bot, ArrowLeft, Construction } from 'lucide-react';

export default function FeatureCatchAll({ params }: { params: { slug: string } }) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="text-yellow-500" size={32} />
                </div>

                <h1 className="text-2xl font-bold mb-2">Feature Not Found on Disk</h1>
                <p className="text-gray-400 mb-6">
                    The database says this feature is deployed, but the code folder
                    <code className="bg-gray-800 text-yellow-500 px-2 py-1 rounded text-sm mx-1">/{params.slug}</code>
                    could not be found on the server.
                </p>

                <div className="text-sm text-gray-500 bg-gray-950 p-4 rounded mb-8 text-left font-mono">
                    Diagnostic:<br />
                    - Status: DEPLOYED (in DB)<br />
                    - Route: 404 (Next.js)<br />
                    - Action: Re-run Refactor Engine
                </div>

                <Link href="/app/ai-lab" className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                    <ArrowLeft size={18} />
                    Back to AI Lab
                </Link>
            </div>
        </div>
    );
}
