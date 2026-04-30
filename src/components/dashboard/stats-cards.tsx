'use client';

import { useState } from 'react';
import { ArrowRightLeft, Flag, Building2, UserCog, Percent } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransferStore, getWeekMonday, computeStats } from '@/lib/transfer-store';
import { useAuth } from '@/lib/auth-context';
import { getManagerTeamIds } from '@/lib/mock-data';
import { getAgentsNeedingCoaching } from '@/lib/constraints';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: { value: number; label: string; positive: boolean };
  icon: React.ReactNode;
  iconBg: string;
  action?: React.ReactNode;
}

function StatCard({ label, value, subtext, trend, icon, iconBg, action }: StatCardProps) {
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
          {action}
        </div>
      </div>
    </div>
  );
}

function TransferRateCard({ teamTransfersThisWeek }: { teamTransfersThisWeek: number }) {
  const { user } = useAuth();
  const { callVolumes, setCallVolume } = useTransferStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [callsInput, setCallsInput] = useState('');

  const weekOf = getWeekMonday();
  const volume = callVolumes.find((v) => v.managerId === user?.id && v.weekOf === weekOf);
  const totalCalls = volume?.totalCalls ?? 0;
  const transferRate = totalCalls > 0 ? ((teamTransfersThisWeek / totalCalls) * 100) : null;

  const rateColor = transferRate === null ? 'text-gray-400'
    : transferRate < 8 ? 'text-emerald-600'
    : transferRate < 10 ? 'text-amber-500'
    : 'text-red-500';

  const rateBg = transferRate === null ? 'bg-gray-50'
    : transferRate < 8 ? 'bg-emerald-50'
    : transferRate < 10 ? 'bg-amber-50'
    : 'bg-red-50';

  const handleSave = () => {
    const n = parseInt(callsInput, 10);
    if (!isNaN(n) && n > 0 && user) {
      setCallVolume(user.id, weekOf, n);
      setModalOpen(false);
      setCallsInput('');
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-start gap-4">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', rateBg)}>
            <Percent className={cn('w-5 h-5', rateColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium mb-1">Transfer Rate (this week)</p>
            {transferRate !== null ? (
              <>
                <p className={cn('text-2xl font-bold leading-none', rateColor)}>
                  {transferRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {teamTransfersThisWeek} transfers / {totalCalls.toLocaleString()} calls · target &lt;10%
                </p>
                <div className={cn('inline-flex items-center gap-1 mt-1.5 text-xs font-medium', rateColor)}>
                  {transferRate < 10
                    ? <><TrendingDown className="w-3.5 h-3.5" /> Within target</>
                    : <><TrendingUp className="w-3.5 h-3.5" /> Above target</>}
                </div>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-300 leading-none">—</p>
                <p className="text-xs text-gray-400 mt-1">Set this week's call volume to see rate</p>
              </>
            )}
            <button
              onClick={() => { setCallsInput(totalCalls ? String(totalCalls) : ''); setModalOpen(true); }}
              className="text-xs text-blue-600 hover:underline mt-1.5 block"
            >
              {volume ? 'Update call volume' : 'Set call volume'}
            </button>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Set This Week's Call Volume" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter your team's total call volume for the week of <strong>{weekOf}</strong>. This is used to calculate your transfer rate.
          </p>
          <Input
            label="Total calls this week"
            type="number"
            placeholder="e.g. 210"
            value={callsInput}
            onChange={(e) => setCallsInput(e.target.value)}
            hint="You can update this at any time during the week."
          />
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={!callsInput || parseInt(callsInput) <= 0}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function DashboardStatsCards() {
  const { user } = useAuth();
  const { transfers } = useTransferStore();

  // Scope transfers to the manager's own team (admin sees all)
  const teamTransfers = user?.role === 'manager'
    ? transfers.filter((t) => getManagerTeamIds(user.id).has(t.agentId))
    : transfers;

  const stats = computeStats(teamTransfers);
  const agentsNeedingCoaching = getAgentsNeedingCoaching(teamTransfers);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-4">
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
      <TransferRateCard teamTransfersThisWeek={stats.totalThisWeek} />
    </div>
  );
}
