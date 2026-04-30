'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { useTransferStore } from '@/lib/transfer-store';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Search, Download, MoreHorizontal, Filter, AlertCircle, CheckCircle, XCircle, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Transfer } from '@/types';

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

const STATUS_TABS = ['All', 'Pending Review', 'Valid', 'Invalid'] as const;

function ReviewModal({ transfer, onClose }: { transfer: Transfer; onClose: () => void }) {
  const { markValid, markInvalid } = useTransferStore();
  const { user } = useAuth();
  const { success } = useToast();
  const [note, setNote] = useState('');
  const [mode, setMode] = useState<'view' | 'invalid'>('view');

  return (
    <Modal open onClose={onClose} title={`Review Transfer · ${transfer.aid}`} size="lg">
      <div className="space-y-4">
        {/* Flag reasons */}
        {(transfer.flagReasons ?? []).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Flagged because:</p>
            {transfer.flagReasons!.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 rounded px-2 py-1.5 mb-1 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                {r}
              </div>
            ))}
          </div>
        )}

        {/* Transfer detail */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm bg-gray-50 rounded-lg p-4">
          {[
            { label: 'Agent', value: transfer.agentName },
            { label: 'Submitted', value: formatTime(transfer.createdAt) },
            { label: 'Department', value: transfer.department },
            { label: 'Partner', value: transfer.partner || 'N/A' },
            { label: 'Reason', value: transfer.reason },
            { label: 'Risk Score', value: `${transfer.riskScore ?? 0}/100` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-gray-900 font-medium">{value}</p>
            </div>
          ))}
        </div>

        {transfer.aiExplanation && (
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-800 mb-0.5">AI Assessment</p>
              <p className="text-xs text-blue-700 leading-relaxed">{transfer.aiExplanation}</p>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Agent notes:</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2 italic">
            {transfer.notes || <span className="text-gray-400">No notes provided.</span>}
          </p>
        </div>

        {mode === 'invalid' ? (
          <div className="space-y-3 border-t border-gray-100 pt-3">
            <Textarea
              label="Feedback note for agent"
              required
              placeholder="Explain to the agent why this transfer was invalid and how to improve..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setMode('view')}>Back</Button>
              <Button variant="danger" className="flex-1" onClick={() => {
                markInvalid(transfer.id, user?.name ?? 'Manager', note);
                success('Marked invalid', `${transfer.aid} marked invalid${note ? ' with feedback' : ''}.`);
                onClose();
              }}>Confirm Invalid</Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 pt-1 border-t border-gray-100">
            <Button
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                markValid(transfer.id, user?.name ?? 'Manager');
                success('Transfer approved', `${transfer.aid} marked as valid.`);
                onClose();
              }}
            >
              <CheckCircle className="w-4 h-4" /> Mark Valid
            </Button>
            <Button variant="danger" className="flex-1 gap-2" onClick={() => setMode('invalid')}>
              <XCircle className="w-4 h-4" /> Mark Invalid
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const { transfers } = useTransferStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]>('All');
  const [page, setPage] = useState(1);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const perPage = 10;

  const scopedTransfers = user?.role === 'agent'
    ? transfers.filter((t) => t.agentId === user.id)
    : transfers;

  const filtered = scopedTransfers.filter((t) => {
    const matchesSearch =
      !search ||
      t.agentName.toLowerCase().includes(search.toLowerCase()) ||
      t.aid.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase()) ||
      t.reason.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Pending Review' && t.status === 'pending_review') ||
      (activeTab === 'Valid' && t.status === 'completed') ||
      (activeTab === 'Invalid' && t.status === 'invalid');
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const reviewingTransfer = reviewingId ? transfers.find((t) => t.id === reviewingId) : null;

  const tabCounts = {
    'All': scopedTransfers.length,
    'Pending Review': scopedTransfers.filter((t) => t.status === 'pending_review').length,
    'Valid': scopedTransfers.filter((t) => t.status === 'completed').length,
    'Invalid': scopedTransfers.filter((t) => t.status === 'invalid').length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={user?.role === 'agent' ? 'My Transfer History' : 'Transfer History'}
        subtitle={user?.role === 'agent' ? 'Your personal submissions and manager feedback.' : 'Review, validate, and manage all team transfers.'}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Manager review call-to-action */}
          {user?.role !== 'agent' && tabCounts['Pending Review'] > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 flex-1">
                <strong>{tabCounts['Pending Review']} transfer{tabCounts['Pending Review'] !== 1 ? 's' : ''}</strong> {tabCounts['Pending Review'] !== 1 ? 'are' : 'is'} waiting for your review.
              </p>
              <Button size="sm" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100"
                onClick={() => { setActiveTab('Pending Review'); setPage(1); }}>
                Review now
              </Button>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder={user?.role === 'agent' ? 'Search your transfers...' : 'Search by agent, AID, dept, reason...'}
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
                  'flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab}
                {tabCounts[tab] > 0 && (
                  <span className={cn(
                    'text-xs rounded-full px-1.5 py-0.5 font-medium',
                    tab === 'Pending Review' ? 'bg-amber-100 text-amber-700' :
                    tab === 'Invalid' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  )}>
                    {tabCounts[tab]}
                  </span>
                )}
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
                      ? ['Time', 'AID', 'Dept', 'Reason', 'Status', '']
                      : ['Time', 'Agent', 'AID', 'Dept', 'Reason', 'Status', '']
                    ).map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                        No transfers match your filters.
                      </td>
                    </tr>
                  ) : pageItems.map((t) => (
                    <>
                      <tr key={t.id} className={cn('hover:bg-gray-50/50 transition-colors', t.status === 'pending_review' && 'bg-amber-50/30')}>
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
                        <td className="px-4 py-3 text-sm text-gray-700">{t.reason}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <StatusBadge status={t.status} />
                            {t.flagReasons && t.flagReasons.length > 0 && t.status === 'pending_review' && (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500" aria-label={t.flagReasons.join(' | ')} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {/* Manager: review button on pending */}
                            {user?.role !== 'agent' && t.status === 'pending_review' && (
                              <button
                                onClick={() => setReviewingId(t.id)}
                                className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors"
                              >
                                Review
                              </button>
                            )}
                            <Link href={`/history/${t.id}`}>
                              <button className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="View details">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                      {/* Agent sees manager note on invalid transfers */}
                      {user?.role === 'agent' && t.status === 'invalid' && t.managerNote && (
                        <tr key={`${t.id}-note`} className="bg-red-50/40">
                          <td colSpan={6} className="px-4 py-2">
                            <div className="flex items-start gap-2 text-xs text-red-800">
                              <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                              <span><strong>Manager feedback:</strong> {t.managerNote}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
                    className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30">&lt;</button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn('w-7 h-7 rounded text-xs font-medium', p === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100')}>{p}</button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30">&gt;</button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {reviewingTransfer && (
        <ReviewModal transfer={reviewingTransfer} onClose={() => setReviewingId(null)} />
      )}
    </div>
  );
}
