'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSFERS } from '@/lib/mock-data';
import { TopBar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Flag } from 'lucide-react';

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

export default function TransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const transfer = TRANSFERS.find((t) => t.id === id);

  if (!transfer) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title="Transfer Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">This transfer does not exist or has been removed.</p>
            <Button onClick={() => router.back()} variant="outline" size="sm">Go back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Transfer Detail" subtitle={`AID: ${transfer.aid}`} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-2xl mx-auto space-y-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </button>

          <Card>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-bold', transfer.agentColor)}>
                  {transfer.agentInitials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{transfer.agentName}</p>
                  <p className="text-sm text-gray-500 font-mono">{transfer.aid}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {transfer.flagged && <Flag className="w-4 h-4 text-red-500" />}
                <StatusBadge status={transfer.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                { label: 'Submitted', value: formatTime(transfer.createdAt) },
                { label: 'Department', value: transfer.department },
                { label: 'Partner', value: transfer.partner || 'N/A' },
                { label: 'Reason', value: transfer.reason },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
                  <p className="text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            {transfer.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{transfer.notes}</p>
              </div>
            )}

            <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
              {transfer.status === 'pending_review' && (
                <>
                  <Button size="sm">Approve</Button>
                  <Button size="sm" variant="danger">Flag as Invalid</Button>
                </>
              )}
              {transfer.status === 'escalated' && (
                <Button size="sm" variant="secondary">Mark Resolved</Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => router.back()}>Back</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
