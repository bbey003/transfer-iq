'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { FEEDBACK_ITEMS, AGENTS, getManagerTeamIds } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { useTransferStore } from '@/lib/transfer-store';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Plus, Star, TrendingUp, AlertCircle, Lightbulb, CheckCheck } from 'lucide-react';

const TYPE_ICONS = {
  recognition: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', label: 'Recognition' },
  coaching: { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200', label: 'Coaching' },
  improvement: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200', label: 'Improvement' },
};

const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  knowledge_gap: { label: 'Knowledge Gap', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  process_issue: { label: 'Process Issue', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  customer_trend: { label: 'Customer Trend', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  suggestion: { label: 'Suggestion', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}

const FEEDBACK_TABS = ['Manager Feedback', 'Agent Observations'] as const;

export default function FeedbackPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { suggestions, markSuggestionRead } = useTransferStore();
  const [activeTab, setActiveTab] = useState<(typeof FEEDBACK_TABS)[number]>('Manager Feedback');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ toId: '', type: '', message: '' });
  const { success } = useToast();

  useEffect(() => {
    if (user?.role === 'agent') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (user?.role === 'agent') return null;

  // Scope suggestions and agent lists to manager's own team
  const teamIds = user?.role === 'manager' ? getManagerTeamIds(user.id) : null;
  const teamSuggestions = teamIds
    ? suggestions.filter((s) => teamIds.has(s.agentId))
    : suggestions;
  const teamAgents = teamIds
    ? AGENTS.filter((a) => teamIds.has(a.id))
    : AGENTS.filter((a) => a.role === 'agent');

  const unreadObservations = teamSuggestions.filter((s) => !s.isRead).length;

  const handleSend = () => {
    if (!form.toId || !form.type || !form.message) return;
    success('Feedback sent', 'Your feedback has been delivered.');
    setModalOpen(false);
    setForm({ toId: '', type: '', message: '' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Feedback" subtitle="Send coaching feedback and review agent observations." />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 border-b border-gray-200">
              {FEEDBACK_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
                    activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab}
                  {tab === 'Agent Observations' && unreadObservations > 0 && (
                    <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5 font-medium">
                      {unreadObservations}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {activeTab === 'Manager Feedback' && (
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Send Feedback
              </Button>
            )}
          </div>

          {/* Manager Feedback tab */}
          {activeTab === 'Manager Feedback' && (
            <Card padding="none">
              <div className="px-5 pt-5 pb-3">
                <CardHeader title="Feedback Log" />
              </div>
              <div className="divide-y divide-gray-50">
                {FEEDBACK_ITEMS.map((item) => {
                  const cfg = TYPE_ICONS[item.type];
                  return (
                    <div
                      key={item.id}
                      className={cn('flex items-start gap-4 px-5 py-4', !item.isRead && 'bg-blue-50/30')}
                    >
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center border shrink-0', cfg.bg)}>
                        <cfg.icon className={cn('w-4 h-4', cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-semibold text-gray-900">To: {item.toName}</p>
                          <Badge variant={item.type === 'recognition' ? 'warning' : item.type === 'coaching' ? 'info' : 'warning'}>
                            {cfg.label}
                          </Badge>
                          {!item.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.message}</p>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {item.fromName} · {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Agent Observations tab */}
          {activeTab === 'Agent Observations' && (
            <>
              {teamSuggestions.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400">
                  No agent observations submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {teamSuggestions.map((s) => {
                    const meta = CATEGORY_META[s.category];
                    return (
                      <div
                        key={s.id}
                        className={cn(
                          'bg-white rounded-xl border p-4 transition-colors',
                          !s.isRead ? 'border-amber-200 bg-amber-50/20' : 'border-gray-200'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', s.agentColor)}>
                            {s.agentInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-sm font-semibold text-gray-900">{s.agentName}</p>
                              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', meta.bg, meta.color)}>
                                {meta.label}
                              </span>
                              {!s.isRead && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{s.message}</p>
                            <p className="text-xs text-gray-400 mt-1.5">{formatDate(s.createdAt)}</p>
                          </div>
                          {!s.isRead && (
                            <button
                              onClick={() => markSuggestionRead(s.id)}
                              className="flex items-center gap-1 text-xs text-gray-400 hover:text-emerald-600 transition-colors shrink-0 mt-0.5"
                              aria-label="Mark as read"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Send Feedback">
        <div className="space-y-4">
          <Select
            label="To"
            required
            placeholder="Select agent"
            value={form.toId}
            onChange={(e) => setForm((f) => ({ ...f, toId: e.target.value }))}
            options={teamAgents.map((a) => ({ value: a.id, label: a.name }))}
          />
          <Select
            label="Type"
            required
            placeholder="Select type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            options={[
              { value: 'recognition', label: 'Recognition' },
              { value: 'coaching', label: 'Coaching' },
              { value: 'improvement', label: 'Improvement' },
            ]}
          />
          <Textarea
            label="Message"
            required
            placeholder="Write your feedback here..."
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={4}
          />
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSend}>Send Feedback</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
