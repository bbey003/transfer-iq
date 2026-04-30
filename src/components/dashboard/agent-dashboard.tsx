'use client';

import { TRANSFERS, FEEDBACK_ITEMS, COACHING_SESSIONS } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { LogTransferForm } from '@/components/transfers/log-transfer-form';
import { cn } from '@/lib/utils';
import { ArrowRightLeft, CheckCircle, Flag, TrendingUp, Calendar, Star, MessageSquare } from 'lucide-react';

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

export function AgentDashboard() {
  const { user } = useAuth();

  const myTransfers = TRANSFERS.filter((t) => t.agentId === user?.id);
  const myFeedback = FEEDBACK_ITEMS.filter((f) => f.toId === user?.id);
  const myCoaching = COACHING_SESSIONS.filter((s) => s.agentId === user?.id);

  const totalThisWeek = myTransfers.length;
  const completedCount = myTransfers.filter((t) => t.status === 'completed').length;
  const flaggedCount = myTransfers.filter((t) => t.flagged).length;
  const pendingCount = myTransfers.filter((t) => t.status === 'pending_review').length;

  const unreadFeedback = myFeedback.filter((f) => !f.isRead).length;

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}</h2>
        <p className="text-sm text-gray-500 mt-0.5">Here's a summary of your transfer activity.</p>
      </div>

      {/* Personal stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'My Transfers (this week)',
            value: totalThisWeek,
            icon: ArrowRightLeft,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
          },
          {
            label: 'Completed',
            value: completedCount,
            icon: CheckCircle,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
          },
          {
            label: 'Pending Review',
            value: pendingCount,
            icon: TrendingUp,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
          },
          {
            label: 'Flagged',
            value: flaggedCount,
            icon: Flag,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', stat.iconBg)}>
              <stat.icon className={cn('w-5 h-5', stat.iconColor)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Log Transfer */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Log a Transfer</h3>
          <LogTransferForm />
        </Card>

        <div className="space-y-5">
          {/* Coaching sessions */}
          {myCoaching.length > 0 && (
            <Card>
              <CardHeader title="My Coaching Sessions" />
              <ul className="space-y-3">
                {myCoaching.map((session) => (
                  <li key={session.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{session.topic}</p>
                        <StatusBadge status={session.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatTime(session.scheduledAt)} · with {session.managerName}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Feedback */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <CardHeader title="My Feedback" />
              {unreadFeedback > 0 && (
                <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 font-medium">
                  {unreadFeedback} new
                </span>
              )}
            </div>
            {myFeedback.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No feedback yet.</p>
            ) : (
              <ul className="space-y-3">
                {myFeedback.map((f) => {
                  const Icon = f.type === 'recognition' ? Star : MessageSquare;
                  const color = f.type === 'recognition' ? 'text-amber-500 bg-amber-50' : 'text-blue-500 bg-blue-50';
                  return (
                    <li
                      key={f.id}
                      className={cn('flex items-start gap-3 p-3 rounded-lg', !f.isRead && 'bg-blue-50/50')}
                    >
                      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0', color)}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 capitalize">{f.type}</p>
                        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{f.message}</p>
                        <p className="text-xs text-gray-400 mt-1">From {f.fromName}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>

      {/* My recent transfers */}
      <Card padding="none">
        <div className="px-5 pt-5 pb-3">
          <CardHeader title="My Recent Transfers" />
        </div>
        {myTransfers.length === 0 ? (
          <div className="px-5 pb-5 text-sm text-gray-400">You haven't logged any transfers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-y border-gray-100 bg-gray-50/50">
                  {['Time', 'AID', 'Department', 'Reason', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myTransfers.slice(0, 6).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatTime(t.createdAt)}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{t.aid}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.reason}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
