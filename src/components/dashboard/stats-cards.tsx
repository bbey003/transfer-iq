'use client';

import { ArrowRightLeft, Flag, Building2, UserCog } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransferStore } from '@/lib/transfer-store';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: { value: number; label: string; positive: boolean };
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ label, value, subtext, trend, icon, iconBg }: StatCardProps) {
  const isUp = trend && trend.value > 0;
  const isGood = trend ? (trend.positive ? isUp : !isUp) : true;

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
          {trend && (
            <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-medium', isGood ? 'text-emerald-600' : 'text-red-500')}>
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend.value > 0 ? '+' : ''}{trend.value} {trend.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsCards() {
  const { stats, agentsNeedingCoaching } = useTransferStore();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Transfers (7 days)"
        value={stats.totalThisWeek.toLocaleString()}
        icon={<ArrowRightLeft className="w-5 h-5 text-blue-600" />}
        iconBg="bg-blue-50"
      />
      <StatCard
        label="Pending Review"
        value={stats.pendingReview}
        subtext={stats.pendingReview > 0 ? 'Awaiting manager review' : 'All transfers reviewed'}
        icon={<Flag className="w-5 h-5 text-amber-500" />}
        iconBg="bg-amber-50"
      />
      <StatCard
        label="Top Transfer Dept"
        value={stats.topDept}
        subtext={`${stats.topDeptPct}% of total transfers`}
        icon={<Building2 className="w-5 h-5 text-orange-500" />}
        iconBg="bg-orange-50"
      />
      <StatCard
        label="Agents Flagged for Review"
        value={agentsNeedingCoaching.length}
        subtext={agentsNeedingCoaching.length > 0 ? agentsNeedingCoaching.map((a) => a.agentName.split(' ')[0]).join(', ') : 'No agents flagged'}
        icon={<UserCog className="w-5 h-5 text-purple-500" />}
        iconBg="bg-purple-50"
      />
    </div>
  );
}
