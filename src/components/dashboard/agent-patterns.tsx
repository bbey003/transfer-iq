'use client';

import { useTransferStore, useAgentPatterns } from '@/lib/transfer-store';
import { useAuth } from '@/lib/auth-context';
import { getManagerTeamIds } from '@/lib/mock-data';
import { Card, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function AgentPatternsCard() {
  const { user } = useAuth();
  const { transfers } = useTransferStore();

  const teamTransfers = user?.role === 'manager'
    ? transfers.filter((t) => getManagerTeamIds(user.id).has(t.agentId))
    : transfers;

  const patterns = useAgentPatterns(teamTransfers);

  return (
    <Card>
      <CardHeader title="Agents with Most Transfers" tooltip="Agents ranked by transfer volume this period" />
      {patterns.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No transfers submitted yet.</p>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-[1.5rem_1fr_auto_180px] gap-3 items-center text-xs font-medium text-gray-400 pb-1 border-b border-gray-100">
            <span>#</span>
            <span>Agent</span>
            <span className="text-right">Transfers</span>
            <span className="text-right pr-1">Volume</span>
          </div>
          {patterns.map((agent) => (
            <div key={agent.id} className="grid grid-cols-[1.5rem_1fr_auto_180px] gap-3 items-center">
              <span className="text-xs font-semibold text-gray-400">{agent.rank}</span>
              <div className="flex items-center gap-2 min-w-0">
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', agent.color)}>
                  {agent.initials}
                </div>
                <span className="text-sm text-gray-800 truncate">{agent.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 text-right">{agent.recurringTransfers}</span>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${agent.percentage}%`,
                    backgroundColor: agent.rank === 1 ? '#ef4444' : agent.rank === 2 ? '#f97316' : '#fbbf24',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
