'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTransferStore } from '@/lib/transfer-store';
import { DEPARTMENTS, PARTNERS, TRANSFER_REASONS } from '@/lib/mock-data';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormState {
  aid: string;
  department: string;
  partner: string;
  reason: string;
  notes: string;
}

const EMPTY: FormState = { aid: '', department: '', partner: '', reason: '', notes: '' };

const KNOWLEDGE_TIPS: Record<string, { note: string }> = {
  'Fraud': { note: 'Fraud transfers are automatically valid. Ensure you have documented the customer\'s concern.' },
  'Partners': { note: '42% of partner transfers are flagged due to insufficient notes. Please describe exactly what you need from the partner team.' },
  'Deposits': { note: 'Check the deposit FAQ and note what you already tried before transferring.' },
  'Manager': { note: 'Manager transfers require justification. Describe clearly why you could not resolve the call.' },
  'Credit': { note: 'Account Access transfers require at least 20 characters of detail about the access issue.' },
};

export function LogTransferForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const { submitTransfer } = useTransferStore();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ status: string; flagReasons: string[] } | null>(null);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const tip = form.department ? KNOWLEDGE_TIPS[form.department] : null;

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.aid.trim()) errs.aid = 'AID is required';
    else if (!/^AID-\d{3,}/i.test(form.aid.trim())) errs.aid = 'Format: AID-XXXXX';
    if (!form.department) errs.department = 'Select a department';
    if (!form.reason) errs.reason = 'Select a reason';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const agentColor = user.id === 'u-101' ? 'bg-purple-500'
      : user.id === 'u-102' ? 'bg-teal-500'
      : user.id === 'u-103' ? 'bg-orange-500'
      : user.id === 'u-104' ? 'bg-blue-500'
      : 'bg-blue-600';

    const { flagReasons, status } = submitTransfer({
      aid: form.aid.trim(),
      department: form.department,
      partner: form.partner,
      reason: form.reason,
      notes: form.notes,
      agentId: user.id,
      agentName: user.name,
      agentInitials: user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      agentColor,
    });

    setSubmitting(false);
    setResult({ status, flagReasons });

    setTimeout(() => {
      setForm(EMPTY);
      setResult(null);
      onSuccess?.();
    }, 4000);
  };

  if (result) {
    const isValid = result.status === 'completed';
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', isValid ? 'bg-emerald-100' : 'bg-amber-100')}>
          {isValid
            ? <CheckCircle className="w-6 h-6 text-emerald-600" />
            : <AlertCircle className="w-6 h-6 text-amber-600" />}
        </div>
        <div>
          <p className={cn('text-sm font-semibold', isValid ? 'text-emerald-700' : 'text-amber-700')}>
            {isValid ? 'Transfer Submitted — Valid' : 'Transfer Submitted — Pending Review'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {isValid
              ? 'Your transfer met all requirements and has been logged as valid.'
              : 'Your transfer has been flagged for manager review.'}
          </p>
        </div>
        {result.flagReasons.length > 0 && (
          <div className="w-full text-left space-y-1.5 mt-1">
            <p className="text-xs font-semibold text-amber-700">Why it was flagged:</p>
            {result.flagReasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 rounded px-2 py-1.5 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {r}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Auto-captured info */}
      <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Auto-captured: {dateStr} {timeStr}</span>
        </div>
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
              <p className="text-xs font-semibold text-blue-800 mb-0.5">Before you transfer</p>
              <p className="text-xs text-blue-700 leading-relaxed">{tip.note}</p>
              <button className="flex items-center gap-1 text-xs text-blue-600 font-medium mt-1.5 hover:underline">
                View knowledge centre <ArrowRight className="w-3 h-3" />
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
          options={DEPARTMENTS.filter((d) => d.status === 'active').map((d) => ({ value: d.name, label: d.name }))}
        />
      </div>

      <Select
        label="Partner"
        placeholder="N/A"
        value={form.partner}
        onChange={set('partner')}
        options={[
          { value: '', label: 'N/A' },
          ...PARTNERS.filter((p) => p.status === 'active').map((p) => ({ value: p.name, label: p.name })),
        ]}
      />

      <Select
        label="Transfer Reason"
        required
        placeholder="Select reason"
        value={form.reason}
        onChange={set('reason')}
        error={errors.reason}
        options={TRANSFER_REASONS.filter((r) => r.status === 'active').map((r) => ({ value: r.label, label: r.label }))}
      />

      <Textarea
        label="Notes"
        placeholder="Describe what you tried and why this transfer is needed..."
        value={form.notes}
        onChange={set('notes')}
        rows={3}
        hint={`${form.notes.length} characters`}
        maxLength={500}
      />

      <div className="flex items-center gap-3 pt-1">
        <Button size="sm" onClick={handleSubmit} loading={submitting} className="flex-1">
          Submit Transfer
        </Button>
      </div>
    </div>
  );
}
