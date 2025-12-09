import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#0F1115]">
            <AppSidebar />
            <div className="flex-1 flex flex-col ml-64">
                <AppHeader />
                <main className="flex-1 overflow-auto p-6 text-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
