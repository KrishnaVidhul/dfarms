// @ts-nocheck

import { useClient } from 'next'
import { Activity, Box, Circle, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProcurementLog {
  id: number;
  timestamp: string;
  action: string;
  user: string;
}

const ProcurementLogs: React.FC = () => {
  const [logs, setLogs] = useState<ProcurementLog[]>([
    { id: 1, timestamp: '2023-04-15T10:00:00Z', action: 'Created Purchase Order', user: 'John Doe' },
    { id: 2, timestamp: '2023-04-15T10:30:00Z', action: 'Updated Supplier Details', user: 'Jane Smith' },
    { id: 3, timestamp: '2023-04-15T11:00:00Z', action: 'Approved Payment Request', user: 'Alice Johnson' }
  ]);

  useEffect(() => {
    // Simulate fetching data from a database
    fetch('/api/procurement-logs')
      .then(response => response.json())
      .then(data => setLogs(data))
      .catch(error => console.error('Error fetching procurement logs:', error));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Procurement Logs</h2>
      <ul className="divide-y divide-gray-700">
        {logs.map(log => (
          <li key={log.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
              <p className="text-base font-medium">{log.action}</p>
            </div>
            <div className="flex items-center space-x-2 opacity-75">
              <User />
              <span>{log.user}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProcurementLogs;