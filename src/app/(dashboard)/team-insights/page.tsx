'use client';

import { TopBar } from '@/components/layout/topbar';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { AGENTS, AGENT_PATTERNS, TRANSFERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

function agentStats(agentId: string) {
  const transfers = TRANSFERS.filter((t) => t.agentId === agentId);
  const flagged = transfers.filter((t) => t.flagged).length;
  const completed = transfers.filter((t) => t.status === 'completed').length;
  return { total: transfers.length, flagged, completed };
}

export default function TeamInsightsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Team Insights" subtitle="Performance overview for your team members." />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Summary row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Agents', value: AGENTS.filter(a => a.status === 'active').length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Agents w/ Recurring Patterns', value: AGENT_PATTERNS.length, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Total Transfers (week)', value: TRANSFERS.length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Flagged Transfers', value: TRANSFERS.filter(t => t.flagged).length, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50' },
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
                    {['Agent', 'AID', 'Status', 'Transfers (week)', 'Flagged', 'Completed', 'Recurring Pattern'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {AGENTS.map((agent) => {
                    const stats = agentStats(agent.id);
                    const pattern = AGENT_PATTERNS.find((p) => p.id === agent.id);
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
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{agent.aid}</td>
                        <td className="px-4 py-3"><StatusBadge status={agent.status} /></td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{stats.total}</td>
                        <td className="px-4 py-3">
                          {stats.flagged > 0
                            ? <span className="text-sm font-semibold text-red-600">{stats.flagged}</span>
                            : <span className="text-sm text-gray-400">0</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{stats.completed}</td>
                        <td className="px-4 py-3">
                          {pattern
                            ? <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2 py-0.5">
                                {pattern.recurringTransfers} recurring
                              </span>
                            : <span className="text-xs text-gray-400">—</span>}
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
