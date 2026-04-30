'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { FEEDBACK_ITEMS, AGENTS } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea, Select } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Plus, Star, TrendingUp, AlertCircle } from 'lucide-react';

const TYPE_ICONS = {
  recognition: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', label: 'Recognition' },
  coaching: { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200', label: 'Coaching' },
  improvement: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200', label: 'Improvement' },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}

export default function FeedbackPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ toId: '', type: '', message: '' });
  const { success } = useToast();

  useEffect(() => {
    if (user?.role === 'agent') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (user?.role === 'agent') return null;

  const handleSend = () => {
    if (!form.toId || !form.type || !form.message) return;
    success('Feedback sent', 'Your feedback has been delivered.');
    setModalOpen(false);
    setForm({ toId: '', type: '', message: '' });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Feedback" subtitle="Send and review coaching feedback for your team." />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Send Feedback
            </Button>
          </div>

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
            options={AGENTS.filter((a) => a.role === 'agent').map((a) => ({ value: a.id, label: a.name }))}
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
