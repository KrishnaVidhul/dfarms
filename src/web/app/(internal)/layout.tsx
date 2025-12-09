import React from 'react';
import AppSidebar from '../../components/layout/AppSidebar';
import AppHeader from '../../components/layout/AppHeader';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#09090B] font-sans antialiased">
            <AppSidebar />
            <AppHeader />
            <main className="pl-64 pt-14 min-h-screen">
                <div className="p-8 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
