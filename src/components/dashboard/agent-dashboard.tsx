'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FEEDBACK_ITEMS, COACHING_SESSIONS } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { useTransferStore } from '@/lib/transfer-store';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, Textarea } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import {
  ArrowRightLeft, CheckCircle, Flag, AlertCircle, Calendar, Star, MessageSquare,
  Lightbulb, ChevronRight, TrendingUp,
} from 'lucide-react';

const SUGGESTION_CATEGORIES: { value: string; label: string }[] = [
  { value: 'knowledge_gap', label: 'Knowledge Gap' },
  { value: 'process_issue', label: 'Process Issue' },
  { value: 'customer_trend', label: 'Customer Trend' },
  { value: 'suggestion', label: 'Suggestion / Idea' },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  knowledge_gap: { label: 'Knowledge Gap', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  process_issue: { label: 'Process Issue', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  customer_trend: { label: 'Customer Trend', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  suggestion: { label: 'Suggestion', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
};

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

export function AgentDashboard() {
  const { user } = useAuth();
  const { transfers, suggestions, submitSuggestion } = useTransferStore();
  const { success } = useToast();

  const [obsCategory, setObsCategory] = useState('');
  const [obsMessage, setObsMessage] = useState('');
  const [obsSubmitting, setObsSubmitting] = useState(false);

  const myTransfers = transfers.filter((t) => t.agentId === user?.id);
  const myFeedback = FEEDBACK_ITEMS.filter((f) => f.toId === user?.id);
  const myCoaching = COACHING_SESSIONS.filter((s) => s.agentId === user?.id);
  const mySuggestions = suggestions.filter((s) => s.agentId === user?.id);

  const totalThisWeek = myTransfers.length;
  const completedCount = myTransfers.filter((t) => t.status === 'completed').length;
  const flaggedCount = myTransfers.filter((t) => t.flagged).length;
  const pendingCount = myTransfers.filter((t) => t.status === 'pending_review').length;
  const unreadFeedback = myFeedback.filter((f) => !f.isRead).length;

  const agentColor = user?.id === 'u-101' ? 'bg-purple-500'
    : user?.id === 'u-102' ? 'bg-teal-500'
    : user?.id === 'u-103' ? 'bg-orange-500'
    : user?.id === 'u-104' ? 'bg-blue-500'
    : user?.id === 'u-201' ? 'bg-cyan-500'
    : user?.id === 'u-202' ? 'bg-rose-500'
    : user?.id === 'u-203' ? 'bg-lime-600'
    : user?.id === 'u-204' ? 'bg-amber-600'
    : user?.id === 'u-205' ? 'bg-sky-600'
    : 'bg-blue-600';

  const handleObsSubmit = async () => {
    if (!obsCategory || !obsMessage.trim() || !user) return;
    setObsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    submitSuggestion({
      agentId: user.id,
      agentName: user.name,
      agentInitials: user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      agentColor,
      category: obsCategory as Parameters<typeof submitSuggestion>[0]['category'],
      message: obsMessage.trim(),
    });
    setObsCategory('');
    setObsMessage('');
    setObsSubmitting(false);
    success('Observation submitted', 'Your manager will review your observation.');
  };

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
          { label: 'My Transfers', value: totalThisWeek, icon: ArrowRightLeft, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
          { label: 'Valid', value: completedCount, icon: CheckCircle, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Pending Review', value: pendingCount, icon: TrendingUp, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
          { label: 'Flagged', value: flaggedCount, icon: Flag, iconBg: 'bg-red-50', iconColor: 'text-red-500' },
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

      {/* Manager feedback on invalid transfers */}
      {myTransfers.some((t) => t.status === 'invalid' && t.managerNote) && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Manager feedback on recent transfers</p>
          {myTransfers.filter((t) => t.status === 'invalid' && t.managerNote).slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-red-700 mb-0.5">{t.aid} · {t.department} · {t.reason}</p>
                <p className="text-sm text-red-800 leading-relaxed">{t.managerNote}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Submit Observation */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Submit Daily Observation</h3>
              <p className="text-xs text-gray-400">Flag a trend, gap, or suggestion for your manager</p>
            </div>
          </div>
          <div className="space-y-3">
            <Select
              label="Category"
              required
              placeholder="What type of observation?"
              value={obsCategory}
              onChange={(e) => setObsCategory(e.target.value)}
              options={SUGGESTION_CATEGORIES}
            />
            <Textarea
              label="What did you notice?"
              required
              placeholder="Describe the pattern, issue, or suggestion in as much detail as you can..."
              value={obsMessage}
              onChange={(e) => setObsMessage(e.target.value)}
              rows={3}
              hint={`${obsMessage.length} characters`}
              maxLength={600}
            />
            <Button
              size="sm"
              onClick={handleObsSubmit}
              loading={obsSubmitting}
              disabled={!obsCategory || !obsMessage.trim()}
              className="w-full"
            >
              Submit Observation
            </Button>
          </div>

          {/* Past observations */}
          {mySuggestions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Your recent observations</p>
              {mySuggestions.slice(0, 3).map((s) => {
                const cfg = CATEGORY_LABELS[s.category];
                return (
                  <div key={s.id} className={cn('rounded-lg px-3 py-2.5 border text-xs', cfg.bg)}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={cn('font-semibold', cfg.color)}>{cfg.label}</span>
                      <span className="text-gray-400">{formatTime(s.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{s.message}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="space-y-5">
          {/* Quick links */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {[
                { href: '/log-transfer', label: 'Log a Transfer', sub: 'Record a new call transfer', icon: ArrowRightLeft },
                { href: '/history', label: 'View My History', sub: 'See all your past transfers', icon: TrendingUp },
                { href: '/knowledge', label: 'Knowledge Centre', sub: 'Valid vs invalid transfer guides', icon: Lightbulb },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Coaching sessions */}
          {myCoaching.length > 0 && (
            <Card>
              <CardHeader title="My Coaching Sessions" />
              <ul className="space-y-3 mt-3">
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

          {/* Manager feedback */}
          {myFeedback.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <CardHeader title="Feedback from Manager" />
                {unreadFeedback > 0 && (
                  <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 font-medium">
                    {unreadFeedback} new
                  </span>
                )}
              </div>
              <ul className="space-y-3">
                {myFeedback.map((f) => {
                  const Icon = f.type === 'recognition' ? Star : MessageSquare;
                  const color = f.type === 'recognition' ? 'text-amber-500 bg-amber-50' : 'text-blue-500 bg-blue-50';
                  return (
                    <li key={f.id} className={cn('flex items-start gap-3 p-3 rounded-lg', !f.isRead && 'bg-blue-50/50')}>
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
            </Card>
          )}
        </div>
      </div>

      {/* My recent transfers */}
      <Card padding="none">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <CardHeader title="My Recent Transfers" />
          <Link href="/history">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        {myTransfers.length === 0 ? (
          <div className="px-5 pb-5 text-sm text-gray-400">
            No transfers yet. <Link href="/log-transfer" className="text-blue-600 hover:underline">Log your first transfer.</Link>
          </div>
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
