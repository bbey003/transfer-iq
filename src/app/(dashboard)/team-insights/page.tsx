'use client';

import { TopBar } from '@/components/layout/topbar';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { AGENTS, getManagerTeamIds } from '@/lib/mock-data';
import { useTransferStore } from '@/lib/transfer-store';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

export default function TeamInsightsPage() {
  const { user } = useAuth();
  const { transfers } = useTransferStore();

  // Scope to manager's own team; admin sees all
  const teamIds = user?.role === 'manager' ? getManagerTeamIds(user.id) : null;
  const teamAgents = teamIds
    ? AGENTS.filter((a) => teamIds.has(a.id))
    : AGENTS;
  const teamTransfers = teamIds
    ? transfers.filter((t) => teamIds.has(t.agentId))
    : transfers;

  function agentStats(agentId: string) {
    const agentTransfers = teamTransfers.filter((t) => t.agentId === agentId);
    const flagged = agentTransfers.filter((t) => t.flagged).length;
    const completed = agentTransfers.filter((t) => t.status === 'completed').length;
    const invalid = agentTransfers.filter((t) => t.status === 'invalid').length;
    return { total: agentTransfers.length, flagged, completed, invalid };
  }

  // Agents with 3+ transfers flagged
  const recurringCount = teamAgents.filter((a) => {
    const s = agentStats(a.id);
    return s.flagged >= 3;
  }).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Team Insights" subtitle="Performance overview for your team members." />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Summary row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Agents', value: teamAgents.filter(a => a.status === 'active').length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Agents w/ Recurring Patterns', value: recurringCount, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Total Transfers (all time)', value: teamTransfers.length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Flagged Transfers', value: teamTransfers.filter(t => t.flagged).length, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', item.bg)}>
                  <item.icon className={cn('w-5 h-5', item.color)} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Agent Table */}
          <Card padding="none">
            <div className="px-5 pt-5 pb-3">
              <CardHeader title="Agent Performance Overview" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50/50">
                    {['Agent', 'BRID', 'Status', 'Total Transfers', 'Flagged', 'Valid', 'Invalid'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {teamAgents.map((agent) => {
                    const stats = agentStats(agent.id);
                    return (
                      <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              {agent.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{agent.brid ?? agent.aid}</td>
                        <td className="px-4 py-3"><StatusBadge status={agent.status} /></td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{stats.total}</td>
                        <td className="px-4 py-3">
                          {stats.flagged > 0
                            ? <span className="text-sm font-semibold text-red-600">{stats.flagged}</span>
                            : <span className="text-sm text-gray-400">0</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{stats.completed}</td>
                        <td className="px-4 py-3">
                          {stats.invalid > 0
                            ? <span className="text-sm font-semibold text-red-500">{stats.invalid}</span>
                            : <span className="text-sm text-gray-400">0</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
