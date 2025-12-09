import React from 'react';
import QualityLab from '../../../../components/QualityLab';

export const dynamic = 'force-dynamic';

export default function QualityPage() {
    return (
        <div className="space-y-4">
            <div className="bg-[#161B22] p-4 rounded-lg border border-[#1F242C]">
                <h1 className="text-xl font-bold text-white mb-1">Quality Control Lab</h1>
                <p className="text-xs text-zinc-500">AI-powered grain analysis and grading</p>
            </div>
            <QualityLab />
        </div>
    );
}
