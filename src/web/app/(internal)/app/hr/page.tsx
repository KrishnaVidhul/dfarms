import { Pool } from 'pg';
import Link from 'next/link';

// Force dynamic to ensure data is fresh
export const dynamic = 'force-dynamic';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function getEmployees() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT * FROM employees ORDER BY id ASC');
        client.release();
        return res.rows;
    } catch (err) {
        console.error('DB Error:', err);
        return [];
    }
}

async function getPayrollStats() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT SUM(salary_per_month) as total_payroll FROM employees WHERE status = $1', ['Active']);
        client.release();
        return res.rows[0];
    } catch (err) {
        return { total_payroll: 0 };
    }
}

export default async function HRPage() {
    const employees = await getEmployees();
    const stats = await getPayrollStats();

    return (
        <main className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-pink-500">Human Resources</h1>
                        <p className="text-gray-400 mt-1">Employee Directory & Payroll Management</p>
                    </div>
                    <Link href="/app" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
                        Back to Dashboard
                    </Link>
                </header>

                {/* Stats Widget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Active Employees</h3>
                        <p className="text-4xl font-bold text-white mt-2">{employees.length}</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Estimated Monthly Payroll</h3>
                        <p className="text-4xl font-bold text-green-400 mt-2">₹{Number(stats.total_payroll).toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-900/20 border border-purple-900/50 p-6 rounded-lg flex flex-col justify-center items-center text-center">
                        <h3 className="text-purple-400 font-bold mb-2">Payroll Run</h3>
                        <p className="text-xs text-gray-400 mb-4">Next automated run in 12 days</p>
                        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold w-full transition-transform active:scale-95">
                            Run Payroll Now
                        </button>
                    </div>
                </div>

                {/* Employee Table */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Employee Directory</h2>
                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-xl">
                        <table className="w-full text-left">
                            <thead className="bg-black/50 text-gray-400 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Salary</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {employees.map((emp: any) => (
                                    <tr key={emp.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{emp.full_name}</td>
                                        <td className="px-6 py-4 text-gray-300">{emp.role}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">{emp.department}</span>
                                        </td>
                                        <td className="px-6 py-4 text-green-400 font-mono">₹{Number(emp.salary_per_month).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full w-fit">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href="#" className="text-blue-400 hover:text-blue-300 text-sm hover:underline">Edit</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}
