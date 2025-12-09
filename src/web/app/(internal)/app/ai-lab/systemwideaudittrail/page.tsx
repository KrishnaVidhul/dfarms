// @ts-nocheck

import { useEffect, useState } from 'react';
import { LucideActivity } from 'lucide-react';
import clsx from 'clsx';

const mockAuditData = [
    {
        id: 1,
        user: "John Doe",
        action: "Logged in",
        timestamp: new Date("2023-04-01T10:00:00Z")
    },
    {
        id: 2,
        user: "Jane Smith",
        action: "Created a new report",
        timestamp: new Date("2023-04-02T12:30:00Z")
    },
    // Add more mock data as needed
];

export default function AuditTrail() {
    const [auditData, setAuditData] = useState(mockAuditData);

    useEffect(() => {
        // Fetch actual audit data from your ERP system here
        // For now, we use mock data
        // setAuditData([...]); // Replace with actual fetched data
    }, []);

    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
                System-wide Audit Trail
            </h2>
            <div className="overflow-x-auto relative">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Timestamp
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditData.map(row => (
                            <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {row.id}
                                </td>
                                <td className="px-6 py-4">{row.user}</td>
                                <td className="px-6 py-4">{row.action}</td>
                                <td className="px-6 py-4">{row.timestamp.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}