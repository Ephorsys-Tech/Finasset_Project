'use client';

import { useState, useEffect } from 'react';
import { History, Shield, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/activity-log')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setLogs(json.data.logs || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#10243A]">Administrative Activity Audit Log</h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable audit record of logins, content modifications, and status changes.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No activity recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Action</th>
                  <th className="py-4 px-6">Entity</th>
                  <th className="py-4 px-6">Summary</th>
                  <th className="py-4 px-6">Admin & IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-[#10243A] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#10243A]">
                      {log.entity}
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      {log.summary}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400 text-[11px]">
                      <div>{log.adminEmail}</div>
                      <div>{log.ipAddress}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
