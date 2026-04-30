'use client';

import { TrendingUp, TrendingDown, Flag, Building2, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DASHBOARD_STATS } from '@/lib/mock-data';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  period?: string;
  positive?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  subtext?: string;
}

function StatCard({ label, value, change, period, positive, icon, iconBg, subtext }: StatCardProps) {
  const isUp = change !== undefined && change > 0;
  const isGood = positive ? isUp : !isUp;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start gap-4">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
          {change !== undefined && period && (
            <div className={cn('flex items-center gap-1 mt-1.5', isGood ? 'text-emerald-600' : 'text-red-500')}>
              {isUp
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />}
              <span className="text-xs font-medium">
                {change > 0 ? '+' : ''}{change}% {period}
              </span>
            </div>
          )}
          {change !== undefined && period === undefined && (
            <div className={cn('flex items-center gap-1 mt-1.5', isGood ? 'text-emerald-600' : 'text-red-500')}>
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span className="text-xs font-medium">
                {change > 0 ? '+' : ''}{change} vs last 7 days
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsCards() {
  const { totalTransfers, invalidFlagged, topDept, agentsNeedingCoaching } = DASHBOARD_STATS;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Transfers"
        value={totalTransfers.value.toLocaleString()}
        change={totalTransfers.change}
        period={totalTransfers.period}
        positive={true}
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-600"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>}
        iconBg="bg-blue-50"
      />
      <StatCard
        label="Invalid Transfers Flagged"
        value={invalidFlagged.value}
        change={invalidFlagged.change}
        period={invalidFlagged.period}
        positive={false}
        icon={<Flag className="w-5 h-5 text-red-500" />}
        iconBg="bg-red-50"
      />
      <StatCard
        label="Top Transfer Dept"
        value={topDept.value}
        subtext={topDept.subtext}
        icon={<Building2 className="w-5 h-5 text-orange-500" />}
        iconBg="bg-orange-50"
      />
      <StatCard
        label="Agents Needing Coaching"
        value={agentsNeedingCoaching.value}
        change={agentsNeedingCoaching.change}
        positive={false}
        icon={<UserCog className="w-5 h-5 text-purple-500" />}
        iconBg="bg-purple-50"
      />
    </div>
  );
}
