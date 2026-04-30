'use client';

import { useState } from 'react';
import { useTransferStore } from '@/lib/transfer-store';
import { useAuth } from '@/lib/auth-context';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { getManagerTeamIds } from '@/lib/mock-data';
import type { Transfer } from '@/types';

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

function ReviewRow({ transfer, onMarkValid, onMarkInvalid }: {
  transfer: Transfer;
  onMarkValid: () => void;
  onMarkInvalid: (note: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [invalidModal, setInvalidModal] = useState(false);
  const [note, setNote] = useState('');

  return (
    <>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Row header */}
        <div
          className="flex items-center gap-3 px-4 py-3 bg-amber-50/60 cursor-pointer hover:bg-amber-50 transition-colors"
          onClick={() => setExpanded((v) => !v)}
          role="button"
          aria-expanded={expanded}
        >
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{transfer.aid}</span>
              <span className="text-xs text-gray-500">·</span>
              <div className="flex items-center gap-1.5">
                <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', transfer.agentColor)}>
                  {transfer.agentInitials}
                </div>
                <span className="text-sm text-gray-700">{transfer.agentName}</span>
              </div>
              <span className="text-xs text-gray-400">{transfer.department} · {transfer.reason}</span>
            </div>
            <p className="text-xs text-amber-700 mt-0.5">
              {transfer.flagReasons?.length ?? 0} flag{(transfer.flagReasons?.length ?? 0) !== 1 ? 's' : ''} · {formatTime(transfer.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1.5"
              onClick={onMarkValid}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Valid
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50 gap-1.5"
              onClick={() => setInvalidModal(true)}
            >
              <XCircle className="w-3.5 h-3.5" />
              Invalid
            </Button>
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="px-4 py-3 border-t border-amber-100 bg-white space-y-3">
            {/* Flag reasons */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Why this was flagged:</p>
              <ul className="space-y-1">
                {(transfer.flagReasons ?? []).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 rounded px-2 py-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            {/* AI explanation */}
            {transfer.aiExplanation && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-800 mb-0.5">AI Assessment</p>
                  <p className="text-xs text-blue-700 leading-relaxed">{transfer.aiExplanation}</p>
                </div>
              </div>
            )}
            {/* Agent notes */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Agent notes:</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2 italic">
                {transfer.notes || <span className="text-gray-400">No notes provided.</span>}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-gray-500">
              <div><span className="font-medium text-gray-700">Partner:</span> {transfer.partner || 'N/A'}</div>
              <div><span className="font-medium text-gray-700">Department:</span> {transfer.department}</div>
              <div><span className="font-medium text-gray-700">Risk score:</span> <span className={cn('font-semibold', (transfer.riskScore ?? 0) >= 50 ? 'text-red-600' : 'text-amber-600')}>{transfer.riskScore ?? 0}/100</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Invalid modal with note */}
      <Modal open={invalidModal} onClose={() => setInvalidModal(false)} title="Mark as Invalid Transfer" size="md">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <p className="font-semibold mb-0.5">You're marking {transfer.aid} as invalid.</p>
            <p className="text-xs text-red-700">The agent will be able to see your note in their dashboard.</p>
          </div>
          <Textarea
            label="Feedback note for agent"
            placeholder="e.g. This transfer did not meet the minimum notes requirement. Please review the partner knowledge base before transferring Information/Clarification queries."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            hint="Optional — but recommended so the agent can improve."
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setInvalidModal(false)}>Cancel</Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                onMarkInvalid(note);
                setInvalidModal(false);
                setNote('');
              }}
            >
              Confirm Invalid
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function ReviewQueue() {
  const { transfers, markValid, markInvalid } = useTransferStore();
  const { user } = useAuth();
  const { success } = useToast();

  const teamIds = user?.role === 'manager' ? getManagerTeamIds(user.id) : null;
  const pending = transfers.filter(
    (t) => t.status === 'pending_review' && (teamIds === null || teamIds.has(t.agentId))
  );

  if (pending.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <CardHeader title={`Review Queue`} subtitle={`${pending.length} transfer${pending.length !== 1 ? 's' : ''} awaiting review`} />
        </div>
      </div>
      <div className="space-y-3">
        {pending.map((t) => (
          <ReviewRow
            key={t.id}
            transfer={t}
            onMarkValid={() => {
              markValid(t.id, user?.name ?? 'Manager');
              success('Transfer approved', `${t.aid} marked as valid.`);
            }}
            onMarkInvalid={(note) => {
              markInvalid(t.id, user?.name ?? 'Manager', note);
              success('Transfer invalidated', `${t.aid} marked as invalid${note ? ' with feedback for the agent' : ''}.`);
            }}
          />
        ))}
      </div>
    </Card>
  );
}
