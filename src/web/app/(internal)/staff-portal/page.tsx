import { Clock, Calendar, CheckCircle } from 'lucide-react';

export default function StaffPortal() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-4 pb-20">
            {/* Header */}
            <header className="mb-8 pt-4">
                <h1 className="text-2xl font-bold text-gray-800">Staff Portal</h1>
                <p className="text-gray-500 text-sm">Manage your shifts and logs</p>
            </header>

            {/* Clock In/Out */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 text-center">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Current Status</div>
                <div className="text-3xl font-bold text-green-600 mb-6">CLOCKED IN</div>
                <div className="text-sm text-gray-500 mb-8">Since 09:00 AM</div>

                <button className="w-full bg-red-500 active:bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 transition-transform active:scale-95 flex items-center justify-center gap-2">
                    <Clock size={20} />
                    CLOCK OUT
                </button>
            </div>

            {/* Quick Actions */}
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Daily Actions</h3>
            <div className="space-y-3">
                <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between active:bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Calendar size={20} />
                        </div>
                        <span className="font-semibold text-gray-700">Log Timesheet</span>
                    </div>
                </button>
                <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between active:bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <CheckCircle size={20} />
                        </div>
                        <span className="font-semibold text-gray-700">Update Task Status</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
