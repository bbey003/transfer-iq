'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { TRANSFERS } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, Download, MoreHorizontal, Filter } from 'lucide-react';
import Link from 'next/link';

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

const STATUS_TABS = ['All', 'Completed', 'Pending Review', 'Escalated', 'Invalid'];

export default function HistoryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Agents see only their own transfers; managers/admins see all
  const scopedTransfers = user?.role === 'agent'
    ? TRANSFERS.filter((t) => t.agentId === user.id)
    : TRANSFERS;
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = scopedTransfers.filter((t) => {
    const matchesSearch =
      !search ||
      t.agentName.toLowerCase().includes(search.toLowerCase()) ||
      t.aid.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === 'All' ||
      t.status.replace(/_/g, ' ').toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={user?.role === 'agent' ? 'My Transfer History' : 'Transfer History'}
        subtitle={user?.role === 'agent' ? 'Your personal transfer submissions.' : 'View and manage all transfer submissions.'}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by agent, AID, or department..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 w-full focus:outline-none"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            {user?.role !== 'agent' && (
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {(user?.role === 'agent'
                      ? ['Time', 'AID', 'Dept', 'Partner', 'Reason', 'Status', '']
                      : ['Time', 'Agent', 'AID', 'Dept', 'Partner', 'Reason', 'Status', '']
                    ).map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                        No transfers match your filters.
                      </td>
                    </tr>
                  ) : pageItems.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatTime(t.createdAt)}</td>
                      {user?.role !== 'agent' && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', t.agentColor)}>
                              {t.agentInitials}
                            </div>
                            <span className="text-sm text-gray-800 whitespace-nowrap">{t.agentName}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{t.aid}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{t.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{t.partner || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{t.reason}</td>
                      <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3">
                        <Link href={`/history/${t.id}`}>
                          <button className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="View details">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30">
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn('w-7 h-7 rounded text-xs font-medium', p === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100')}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30">
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
