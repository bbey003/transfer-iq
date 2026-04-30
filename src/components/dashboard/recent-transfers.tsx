'use client';

import { TRANSFERS } from '@/lib/mock-data';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

export function RecentTransfersTable() {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const total = TRANSFERS.length;
  const totalPages = Math.ceil(total / perPage);
  const pageItems = TRANSFERS.slice((page - 1) * perPage, page * perPage);

  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-3">
        <CardHeader
          title="Recent Transfers"
          tooltip="The most recent transfers submitted by your team"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/50">
              {['Time', 'Agent', 'AID', 'Dept', 'Reason', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pageItems.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatTime(t.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', t.agentColor)}>
                      {t.agentInitials}
                    </div>
                    <span className="text-sm text-gray-800 whitespace-nowrap">{t.agentName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-gray-600">{t.aid}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.department}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.reason}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Transfer options">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, total)} of {total} results
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-xs"
            aria-label="Previous page"
          >
            {'<'}
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded text-xs font-medium',
                p === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              )}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          {totalPages > 5 && <span className="text-gray-400 text-xs px-1">...</span>}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 text-xs"
            aria-label="Next page"
          >
            {'>'}
          </button>
        </div>
      </div>
    </Card>
  );
}
