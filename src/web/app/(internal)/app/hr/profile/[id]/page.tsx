export default function EmployeeProfile({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-[#0F1115] text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Employee Profile #{params.id}</h1>
            <div className="p-6 bg-[#161B22] border border-[#1F242C] rounded-xl">
                <p className="text-gray-400">Profile management for Employee ID {params.id} is under construction.</p>
                <p className="text-emerald-500 mt-2">Check back later for Time & Attendance integration.</p>
            </div>
        </div>
    );
}
