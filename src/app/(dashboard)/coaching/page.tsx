'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { COACHING_SESSIONS, AGENT_PATTERNS } from '@/lib/mock-data';
import { Card, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Plus, GraduationCap, Calendar } from 'lucide-react';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

export default function CoachingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ agentId: '', topic: '', scheduledAt: '', notes: '' });
  const { success } = useToast();

  const handleCreate = () => {
    if (!form.agentId || !form.topic || !form.scheduledAt) return;
    success('Session scheduled', `Coaching session has been created.`);
    setModalOpen(false);
    setForm({ agentId: '', topic: '', scheduledAt: '', notes: '' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Coaching" subtitle="Schedule and track agent coaching sessions." />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Agents needing coaching */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardHeader title="Agents Flagged for Coaching" />
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Schedule Session
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {AGENT_PATTERNS.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    agent.rank <= 2 ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
                  )}
                >
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0', agent.color)}>
                    {agent.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                    <p className={cn('text-xs', agent.rank <= 2 ? 'text-red-600' : 'text-amber-700')}>
                      {agent.recurringTransfers} recurring transfers
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                    Schedule
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Sessions */}
          <Card padding="none">
            <div className="px-5 pt-5 pb-3">
              <CardHeader title="Coaching Sessions" />
            </div>
            <div className="divide-y divide-gray-50">
              {COACHING_SESSIONS.map((session) => (
                <div key={session.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {session.agentName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{session.agentName}</p>
                      <StatusBadge status={session.status} />
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{session.topic}</p>
                    {session.notes && <p className="text-xs text-gray-500 mt-1">{session.notes}</p>}
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(session.scheduledAt)}</span>
                      <span className="mx-1">·</span>
                      <span>with {session.managerName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {session.status === 'scheduled' && (
                      <Button size="sm" variant="ghost">Mark Complete</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Coaching Session">
        <div className="space-y-4">
          <Select
            label="Agent"
            required
            placeholder="Select agent"
            value={form.agentId}
            onChange={(e) => setForm((f) => ({ ...f, agentId: e.target.value }))}
            options={AGENT_PATTERNS.map((a) => ({ value: a.id, label: a.name }))}
          />
          <Input
            label="Topic"
            required
            placeholder="e.g. Reducing partner transfer frequency"
            value={form.topic}
            onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
          />
          <Input
            label="Scheduled At"
            type="datetime-local"
            required
            value={form.scheduledAt}
            onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
          />
          <Textarea
            label="Notes"
            placeholder="Session notes or agenda..."
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={3}
          />
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreate}>Schedule Session</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
