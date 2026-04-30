'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTransferStore } from '@/lib/transfer-store';
import type { PrecomputedAnalysis } from '@/lib/transfer-store';
import { useQuickNotes } from '@/lib/quick-notes';
import type { NoteTemplate } from '@/lib/quick-notes';
import { DEPARTMENTS, PARTNERS, TRANSFER_REASONS } from '@/lib/mock-data';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import {
  BookOpen, ArrowRight, Calendar, User, CheckCircle, AlertCircle,
  Zap, Plus, Pencil, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react';
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
  Fraud:    { note: 'Fraud transfers are automatically valid. Ensure you have documented the customer\'s concern.' },
  Partners: { note: '42% of partner transfers are flagged due to insufficient notes. Please describe exactly what you need from the partner team.' },
  Deposits: { note: 'Check the deposit FAQ and note what you already tried before transferring.' },
  Manager:  { note: 'Manager transfers require justification. Describe clearly why you could not resolve the call.' },
  Credit:   { note: 'Account Access transfers require at least 20 characters of detail about the access issue.' },
};

const AGENT_COLORS: Record<string, string> = {
  'u-101': 'bg-purple-500',
  'u-102': 'bg-teal-500',
  'u-103': 'bg-orange-500',
  'u-104': 'bg-blue-500',
};

async function callAiAnalysis(
  department: string,
  partner: string,
  reason: string,
  notes: string,
  articleJson: object | null,
): Promise<PrecomputedAnalysis | null> {
  try {
    const res = await fetch('/api/analyze-transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department, partner, reason, notes, article: articleJson }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return {
      status: data.status ?? 'pending_review',
      flagReasons: data.flagReasons ?? [],
      riskScore: data.riskScore ?? 50,
      aiExplanation: data.aiExplanation,
    };
  } catch {
    return null;
  }
}

// ---------- Template manager modal ----------

function ManageTemplatesModal({
  open,
  onClose,
  templates,
  onAdd,
  onUpdate,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  templates: NoteTemplate[];
  onAdd: (t: Omit<NoteTemplate, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Omit<NoteTemplate, 'id'>>) => void;
  onDelete: (id: string) => void;
}) {
  const { success } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ label: '', department: '', text: '' });

  const openEdit = (t: NoteTemplate) => {
    setEditId(t.id);
    setForm({ label: t.label, department: t.department, text: t.text });
    setAddOpen(false);
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ label: '', department: '', text: '' });
    setAddOpen(true);
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.text.trim()) return;
    if (editId) {
      onUpdate(editId, { label: form.label.trim(), department: form.department, text: form.text.trim() });
      success('Template updated');
      setEditId(null);
    } else {
      onAdd({ label: form.label.trim(), department: form.department, text: form.text.trim() });
      success('Template saved');
      setAddOpen(false);
    }
    setForm({ label: '', department: '', text: '' });
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    if (editId === id) setEditId(null);
    success('Template deleted');
  };

  return (
    <Modal open={open} onClose={onClose} title="Manage Note Templates" size="lg">
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        {/* Template list */}
        {templates.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No templates yet. Add one below.</p>
        ) : (
          <div className="space-y-2">
            {templates.map((t) => (
              <div key={t.id}>
                <div className={cn(
                  'border rounded-xl px-4 py-3 transition-colors',
                  editId === t.id ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-white hover:bg-gray-50/50'
                )}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900">{t.label}</p>
                        {t.department && (
                          <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded px-1.5 py-0.5">{t.department}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{t.text}</p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={() => editId === t.id ? setEditId(null) : openEdit(t)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                        aria-label="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline edit form */}
                  {editId === t.id && (
                    <div className="mt-3 pt-3 border-t border-blue-100 space-y-2">
                      <Input
                        label="Label"
                        value={form.label}
                        onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                        placeholder="Short name for this template"
                      />
                      <Select
                        label="Department (optional)"
                        value={form.department}
                        onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                        options={[
                          { value: '', label: 'All departments' },
                          ...DEPARTMENTS.filter((d) => d.status === 'active').map((d) => ({ value: d.name, label: d.name })),
                        ]}
                      />
                      <Textarea
                        label="Note text"
                        rows={3}
                        value={form.text}
                        onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                        placeholder="The note text that will fill in the field..."
                      />
                      <div className="flex gap-2 pt-1">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditId(null)}>Cancel</Button>
                        <Button size="sm" className="flex-1" onClick={handleSave} disabled={!form.label.trim() || !form.text.trim()}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new */}
        {!editId && (
          <div className="border border-dashed border-gray-300 rounded-xl">
            {addOpen ? (
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-600 mb-2">New template</p>
                <Input
                  label="Label"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="e.g. Fraud — Unrecognised transaction"
                />
                <Select
                  label="Department (optional)"
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  options={[
                    { value: '', label: 'All departments' },
                    ...DEPARTMENTS.filter((d) => d.status === 'active').map((d) => ({ value: d.name, label: d.name })),
                  ]}
                />
                <Textarea
                  label="Note text"
                  rows={3}
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  placeholder="The note text that will fill in the field..."
                  hint={`${form.text.length} characters`}
                />
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
                  <Button size="sm" className="flex-1" onClick={handleSave} disabled={!form.label.trim() || !form.text.trim()}>
                    Save Template
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={openAdd}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add new template
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ---------- Quick fill chips ----------

function QuickFillBar({
  templates,
  department,
  onSelect,
  onManage,
}: {
  templates: NoteTemplate[];
  department: string;
  onSelect: (text: string) => void;
  onManage: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const relevant = department
    ? templates.filter((t) => !t.department || t.department === department)
    : templates;

  const visible = expanded ? relevant : relevant.slice(0, 4);
  const hasMore = relevant.length > 4;

  if (templates.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Zap className="w-3 h-3 text-blue-500 shrink-0" />
        <span className="text-xs font-medium text-gray-500">Quick fill</span>
        <button
          onClick={onManage}
          className="ml-auto text-xs text-gray-400 hover:text-blue-600 transition-colors"
        >
          Manage
        </button>
      </div>
      {relevant.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No templates for this department yet.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {visible.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.text)}
              className="inline-flex items-center text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 hover:border-blue-200 rounded-lg px-2.5 py-1 transition-colors text-left max-w-full"
              title={t.text}
            >
              <span className="truncate max-w-[200px]">{t.label}</span>
            </button>
          ))}
          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-600 px-1.5 py-1 transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="w-3 h-3" /> less</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> +{relevant.length - 4} more</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Main form ----------

export function LogTransferForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const { submitTransfer, articles } = useTransferStore();
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useQuickNotes(user?.id ?? '');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ status: string; flagReasons: string[]; aiExplanation?: string } | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

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

    const agentColor = AGENT_COLORS[user.id] ?? 'bg-blue-600';
    const transferData = {
      aid: form.aid.trim(),
      department: form.department,
      partner: form.partner,
      reason: form.reason,
      notes: form.notes,
      agentId: user.id,
      agentName: user.name,
      agentInitials: user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      agentColor,
    };

    const article = articles.find((a) => a.isActive && a.department === form.department) ?? null;
    const precomputed = await callAiAnalysis(
      form.department, form.partner, form.reason, form.notes, article,
    );

    const { flagReasons, status } = submitTransfer(transferData, precomputed ?? undefined);

    setSubmitting(false);
    setResult({ status, flagReasons, aiExplanation: precomputed?.aiExplanation });

    setTimeout(() => {
      setForm(EMPTY);
      setResult(null);
      onSuccess?.();
    }, 5000);
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
        {result.aiExplanation && (
          <div className="w-full text-left bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5">
            <p className="text-xs font-semibold text-blue-800 mb-0.5">AI Assessment</p>
            <p className="text-xs text-blue-700 leading-relaxed">{result.aiExplanation}</p>
          </div>
        )}
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
    <>
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

        {/* Notes + quick fill */}
        <div>
          <Textarea
            label="Notes"
            placeholder="Describe what you tried and why this transfer is needed..."
            value={form.notes}
            onChange={set('notes')}
            rows={3}
            hint={`${form.notes.length} characters`}
            maxLength={500}
          />
          <QuickFillBar
            templates={templates}
            department={form.department}
            onSelect={(text) => setForm((f) => ({ ...f, notes: text }))}
            onManage={() => setManageOpen(true)}
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button size="sm" onClick={handleSubmit} loading={submitting} className="flex-1">
            {submitting ? 'Analysing...' : 'Submit Transfer'}
          </Button>
        </div>
      </div>

      <ManageTemplatesModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        templates={templates}
        onAdd={addTemplate}
        onUpdate={updateTemplate}
        onDelete={deleteTemplate}
      />
    </>
  );
}
