'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DEPARTMENTS, PARTNERS, TRANSFER_REASONS } from '@/lib/mock-data';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { BookOpen, ArrowRight, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormState {
  aid: string;
  department: string;
  partner: string;
  reason: string;
  notes: string;
}

const EMPTY: FormState = { aid: '', department: '', partner: '', reason: '', notes: '' };

const KNOWLEDGE_TIP = {
  'Fraud': { reason: 'Information / Clarification', pct: 38, note: 'is the top transfer reason today (38%). Please review knowledge articles before transferring if possible.' },
  'Partners': { reason: 'Information / Clarification', pct: 42, note: 'accounts for 42% of partner transfers. Check the partner portal FAQ first.' },
  'Deposits': { reason: 'System / Process Issue', pct: 28, note: 'accounts for 28% of deposit transfers. Verify app status before escalating.' },
};

export function LogTransferForm() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const tip = form.department ? KNOWLEDGE_TIP[form.department as keyof typeof KNOWLEDGE_TIP] : null;

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.aid.trim()) errs.aid = 'AID is required';
    else if (!/^AID-\d{4,}$/i.test(form.aid.trim())) errs.aid = 'Format: AID-XXXXX';
    if (!form.department) errs.department = 'Select a department';
    if (!form.reason) errs.reason = 'Select a reason';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
    success('Transfer submitted', `AID ${form.aid} logged successfully.`);
    setTimeout(() => {
      setForm(EMPTY);
      setSubmitted(false);
    }, 2000);
  };

  const handleSaveDraft = () => {
    success('Draft saved', 'Your transfer has been saved as a draft.');
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-900">Transfer Submitted!</p>
        <p className="text-xs text-gray-500">AID {form.aid} has been logged.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Auto-captured info */}
      <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Auto-captured</span>
        </div>
        <span className="text-gray-400">{dateStr} {timeStr}</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <User className="w-3.5 h-3.5" />
          <span>{user?.name} ({user?.role === 'agent' ? (user?.brid ?? user?.aid) : user?.aid})</span>
        </div>
      </div>

      {/* Knowledge tip */}
      {tip && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-blue-800 mb-0.5">Knowledge theme today</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>{tip.reason}</strong> {tip.note}
              </p>
              <button className="flex items-center gap-1 text-xs text-blue-600 font-medium mt-1.5 hover:underline">
                View knowledge center <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="AID"
          required
          placeholder="AID-87322"
          value={form.aid}
          onChange={set('aid')}
          error={errors.aid}
        />
        <Select
          label="Department"
          required
          placeholder="Select department"
          value={form.department}
          onChange={set('department')}
          error={errors.department}
          options={DEPARTMENTS.filter((d) => d.status === 'active').map((d) => ({
            value: d.name,
            label: d.name,
          }))}
        />
      </div>

      <Select
        label="Partner"
        placeholder="Select partner"
        value={form.partner}
        onChange={set('partner')}
        options={[
          { value: 'N/A', label: 'N/A' },
          ...PARTNERS.filter((p) => p.status === 'active').map((p) => ({
            value: p.name,
            label: p.name,
          })),
        ]}
      />

      <Select
        label="Transfer Reason"
        required
        placeholder="Select reason"
        value={form.reason}
        onChange={set('reason')}
        error={errors.reason}
        options={TRANSFER_REASONS.filter((r) => r.status === 'active').map((r) => ({
          value: r.label,
          label: r.label,
        }))}
      />

      <Textarea
        label="Notes"
        placeholder="Add any additional details..."
        value={form.notes}
        onChange={set('notes')}
        rows={3}
        hint={`${form.notes.length}/500`}
        maxLength={500}
      />

      <div className="flex items-center gap-3 pt-1">
        <Button variant="outline" size="sm" onClick={handleSaveDraft} className="flex-1">
          Save Draft
        </Button>
        <Button size="sm" onClick={handleSubmit} loading={submitting} className="flex-1">
          Submit Transfer
        </Button>
      </div>
    </div>
  );
}
