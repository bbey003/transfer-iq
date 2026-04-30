'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { DEPARTMENTS, PARTNERS, TRANSFER_REASONS, AGENTS, MANAGERS } from '@/lib/mock-data';
import { useTransferStore } from '@/lib/transfer-store';
import type { Department, Partner, TransferReason, KnowledgeArticle, KnowledgeArticleReason } from '@/types';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Plus, Pencil, MoreHorizontal, Shield, TrendingUp, TrendingDown, AlertCircle, Trash2, BookOpen, CheckCircle, XCircle } from 'lucide-react';

const TABS = ['Teams', 'Departments', 'Partners', 'Transfer Reasons', 'Articles', 'Users'] as const;
type Tab = (typeof TABS)[number];

function TeamBreakdown() {
  const { transfers, callVolumes } = useTransferStore();

  return (
    <div className="space-y-5">
      {MANAGERS.map((manager) => {
        const teamAgents = AGENTS.filter((a) => a.managerId === manager.id);
        const teamIds = new Set(teamAgents.map((a) => a.id));
        const teamTransfers = transfers.filter((t) => teamIds.has(t.agentId));

        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekTransfers = teamTransfers.filter((t) => new Date(t.createdAt) >= weekAgo);

        const validCount = teamTransfers.filter((t) => t.status === 'completed').length;
        const invalidCount = teamTransfers.filter((t) => t.status === 'invalid').length;
        const pendingCount = teamTransfers.filter((t) => t.status === 'pending_review').length;
        const invalidRate = teamTransfers.length > 0 ? Math.round((invalidCount / teamTransfers.length) * 100) : 0;

        const latestVolume = callVolumes
          .filter((v) => v.managerId === manager.id)
          .sort((a, b) => b.weekOf.localeCompare(a.weekOf))[0];
        const transferRate = latestVolume
          ? ((weekTransfers.length / latestVolume.totalCalls) * 100).toFixed(1)
          : null;
        const rateNum = transferRate ? parseFloat(transferRate) : null;

        return (
          <Card key={manager.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {manager.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{manager.name}</p>
                  <p className="text-xs text-gray-500">{manager.aid} · {teamAgents.filter((a) => a.status === 'active').length} active agents</p>
                </div>
              </div>
              {rateNum !== null && (
                <div className={cn(
                  'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg',
                  rateNum < 8 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  rateNum < 10 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                )}>
                  {rateNum < 10 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  {rateNum}% transfer rate
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total Transfers', value: teamTransfers.length, color: 'text-gray-900' },
                { label: 'Valid', value: validCount, color: 'text-emerald-600' },
                { label: 'Pending Review', value: pendingCount, color: 'text-amber-600' },
                { label: 'Invalid', value: invalidCount, sub: `${invalidRate}% rate`, color: invalidRate > 20 ? 'text-red-600' : 'text-gray-700' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                  <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
                  {s.sub && <p className="text-xs text-gray-400">{s.sub}</p>}
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Agents</p>
              <div className="divide-y divide-gray-50">
                {teamAgents.map((agent) => {
                  const agentTransfers = teamTransfers.filter((t) => t.agentId === agent.id);
                  const agentInvalid = agentTransfers.filter((t) => t.status === 'invalid').length;
                  const agentPending = agentTransfers.filter((t) => t.status === 'pending_review').length;
                  return (
                    <div key={agent.id} className="flex items-center gap-3 py-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {agent.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                          <span className="text-xs text-gray-400 font-mono">{agent.brid}</span>
                          {agent.status === 'suspended' && <StatusBadge status="suspended" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs shrink-0">
                        <span className="text-gray-600">{agentTransfers.length} transfers</span>
                        {agentPending > 0 && (
                          <span className="text-amber-600 font-medium">{agentPending} pending</span>
                        )}
                        {agentInvalid > 0 && (
                          <span className="flex items-center gap-1 text-red-600 font-medium">
                            <AlertCircle className="w-3 h-3" />{agentInvalid} invalid
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ---------- Article editor ----------

type ArticleForm = {
  summary: string;
  minNotes: string;
  validReasons: KnowledgeArticleReason[];
  invalidReasons: KnowledgeArticleReason[];
  tips: string[];
  isActive: boolean;
};

function reasonsEqual(a: KnowledgeArticleReason[], b: KnowledgeArticleReason[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function ArticlesTab() {
  const { articles, updateArticle } = useTransferStore();
  const { success } = useToast();

  const [editArticle, setEditArticle] = useState<KnowledgeArticle | null>(null);
  const [form, setForm] = useState<ArticleForm>({
    summary: '', minNotes: '', validReasons: [], invalidReasons: [], tips: [], isActive: true,
  });

  const openEdit = (article: KnowledgeArticle) => {
    setEditArticle(article);
    setForm({
      summary: article.summary,
      minNotes: article.minNotes ?? '',
      validReasons: article.validReasons.map((r) => ({ ...r })),
      invalidReasons: article.invalidReasons.map((r) => ({ ...r })),
      tips: [...article.tips],
      isActive: article.isActive,
    });
  };

  const handleSave = () => {
    if (!editArticle) return;
    updateArticle(editArticle.id, {
      summary: form.summary.trim(),
      minNotes: form.minNotes.trim() || undefined,
      validReasons: form.validReasons.filter((r) => r.reason.trim()),
      invalidReasons: form.invalidReasons.filter((r) => r.reason.trim()),
      tips: form.tips.filter((t) => t.trim()),
      isActive: form.isActive,
    });
    success('Article updated');
    setEditArticle(null);
  };

  const updateReason = (
    type: 'validReasons' | 'invalidReasons',
    idx: number,
    field: keyof KnowledgeArticleReason,
    value: string,
  ) => {
    setForm((f) => {
      const arr = [...f[type]];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...f, [type]: arr };
    });
  };

  const addReason = (type: 'validReasons' | 'invalidReasons') => {
    setForm((f) => ({ ...f, [type]: [...f[type], { reason: '', example: '' }] }));
  };

  const removeReason = (type: 'validReasons' | 'invalidReasons', idx: number) => {
    setForm((f) => ({ ...f, [type]: f[type].filter((_, i) => i !== idx) }));
  };

  const updateTip = (idx: number, value: string) => {
    setForm((f) => { const t = [...f.tips]; t[idx] = value; return { ...f, tips: t }; });
  };

  const addTip = () => setForm((f) => ({ ...f, tips: [...f.tips, ''] }));
  const removeTip = (idx: number) => setForm((f) => ({ ...f, tips: f.tips.filter((_, i) => i !== idx) }));

  return (
    <>
      <div className="space-y-3">
        {articles.map((article) => (
          <Card key={article.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', article.isActive ? 'bg-blue-50' : 'bg-gray-100')}>
                <BookOpen className={cn('w-4 h-4', article.isActive ? 'text-blue-600' : 'text-gray-400')} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{article.department}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{article.summary}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {article.validReasons.length}
                <XCircle className="w-3.5 h-3.5 text-red-400 ml-1" />
                {article.invalidReasons.length}
              </div>
              {!article.isActive && (
                <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Inactive</span>
              )}
              <button
                onClick={() => openEdit(article)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                aria-label="Edit article"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={!!editArticle}
        onClose={() => setEditArticle(null)}
        title={`Edit Article — ${editArticle?.department}`}
        size="lg"
      >
        {editArticle && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Active toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={cn(
                  'w-10 h-5 rounded-full transition-colors relative',
                  form.isActive ? 'bg-blue-600' : 'bg-gray-300'
                )}
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              >
                <span className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                  form.isActive ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </div>
              <span className="text-sm text-gray-700">{form.isActive ? 'Active — visible to agents' : 'Inactive — hidden from agents'}</span>
            </label>

            {/* Summary */}
            <Textarea
              label="Summary"
              required
              rows={2}
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              placeholder="Brief description of when to transfer to this department."
            />

            {/* Min notes requirement */}
            <Input
              label="Notes requirement (optional)"
              value={form.minNotes}
              onChange={(e) => setForm((f) => ({ ...f, minNotes: e.target.value }))}
              placeholder="e.g. Minimum 30 characters required. Describe what you checked."
            />

            {/* Valid reasons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Valid reasons
                </p>
                <Button size="sm" variant="outline" onClick={() => addReason('validReasons')}>
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {form.validReasons.map((r, i) => (
                  <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 space-y-2">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 text-xs bg-white border border-emerald-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        placeholder="Reason"
                        value={r.reason}
                        onChange={(e) => updateReason('validReasons', i, 'reason', e.target.value)}
                      />
                      <button onClick={() => removeReason('validReasons', i)} className="p-1.5 text-red-400 hover:text-red-600 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      className="w-full text-xs bg-white border border-emerald-100 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-gray-500"
                      placeholder="Example (optional)"
                      value={r.example ?? ''}
                      onChange={(e) => updateReason('validReasons', i, 'example', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Invalid reasons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Invalid reasons
                </p>
                <Button size="sm" variant="outline" onClick={() => addReason('invalidReasons')}>
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {form.invalidReasons.map((r, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3 space-y-2">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 text-xs bg-white border border-red-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-400"
                        placeholder="Reason"
                        value={r.reason}
                        onChange={(e) => updateReason('invalidReasons', i, 'reason', e.target.value)}
                      />
                      <button onClick={() => removeReason('invalidReasons', i)} className="p-1.5 text-red-400 hover:text-red-600 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      className="w-full text-xs bg-white border border-red-100 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-400 text-gray-500"
                      placeholder="Example (optional)"
                      value={r.example ?? ''}
                      onChange={(e) => updateReason('invalidReasons', i, 'example', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick tips</p>
                <Button size="sm" variant="outline" onClick={addTip}>
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {form.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">{i + 1}</span>
                    <input
                      className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="Tip text"
                      value={tip}
                      onChange={(e) => updateTip(i, e.target.value)}
                    />
                    <button onClick={() => removeTip(i)} className="p-1.5 text-gray-400 hover:text-red-500 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
              <Button variant="outline" className="flex-1" onClick={() => setEditArticle(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

// ---------- Main page ----------

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Teams');
  const [depts, setDepts] = useState<Department[]>(DEPARTMENTS);
  const [partners, setPartners] = useState<Partner[]>(PARTNERS);
  const [reasons, setReasons] = useState<TransferReason[]>(TRANSFER_REASONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | Partner | TransferReason | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const { success } = useToast();

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (item: Department | Partner | TransferReason) => {
    setEditTarget(item);
    const nameVal = 'label' in item ? item.label : item.name;
    const descVal = 'description' in item ? (item as Department).description : '';
    setForm({ name: nameVal, description: descVal });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (activeTab === 'Departments') {
      if (editTarget) {
        setDepts((prev) => prev.map((d) => d.id === editTarget.id ? { ...d, name: form.name, description: form.description } : d));
      } else {
        setDepts((prev) => [...prev, { id: `d-${Date.now()}`, name: form.name, description: form.description, status: 'active', createdAt: new Date().toISOString() }]);
      }
    } else if (activeTab === 'Partners') {
      if (editTarget) {
        setPartners((prev) => prev.map((p) => p.id === editTarget.id ? { ...p, name: form.name, description: form.description } : p));
      } else {
        setPartners((prev) => [...prev, { id: `p-${Date.now()}`, name: form.name, description: form.description, status: 'active' }]);
      }
    } else if (activeTab === 'Transfer Reasons') {
      if (editTarget) {
        setReasons((prev) => prev.map((r) => r.id === editTarget.id ? { ...r, label: form.name } : r));
      } else {
        setReasons((prev) => [...prev, { id: `r-${Date.now()}`, label: form.name, category: 'General', status: 'active' }]);
      }
    }
    success(editTarget ? 'Updated successfully' : 'Added successfully');
    setModalOpen(false);
  };

  const toggleStatus = (id: string, type: Tab) => {
    if (type === 'Departments') {
      setDepts((prev) => prev.map((d) => d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d));
    } else if (type === 'Partners') {
      setPartners((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
    }
    success('Status updated');
  };

  const allUsers = [...MANAGERS, ...AGENTS];
  const showAddButton = activeTab !== 'Users' && activeTab !== 'Teams' && activeTab !== 'Articles';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Admin Settings" subtitle="Team overview, departments, partners, and users." />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 border-b border-gray-200 flex-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap',
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            {showAddButton && (
              <Button size="sm" onClick={openAdd} className="ml-4 shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Add {activeTab.replace(/s$/, '').replace('Transfer Reason', 'Reason')}
              </Button>
            )}
          </div>

          {activeTab === 'Teams' && <TeamBreakdown />}

          {activeTab === 'Articles' && <ArticlesTab />}

          {activeTab === 'Departments' && (
            <Card padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['Department', 'Description', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {depts.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{d.description}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(d)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" aria-label="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleStatus(d.id, 'Departments')} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" aria-label="Toggle status">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {activeTab === 'Partners' && (
            <Card padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['Partner', 'Description', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {partners.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{p.description}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" aria-label="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleStatus(p.id, 'Partners')} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" aria-label="Toggle status">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {activeTab === 'Transfer Reasons' && (
            <Card padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['Reason', 'Category', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reasons.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.label}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{r.category}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" aria-label="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {activeTab === 'Users' && (
            <Card padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['User', 'Email', 'AID / BRID', 'Role', 'Team', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allUsers.map((u) => {
                    const manager = MANAGERS.find((m) => m.id === u.managerId);
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                              {u.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">
                          {u.role === 'agent' && u.brid
                            ? <span><span className="text-gray-400 text-xs mr-1">BRID</span>{u.brid}</span>
                            : <span><span className="text-gray-400 text-xs mr-1">AID</span>{u.aid}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {u.role === 'admin' && <Shield className="w-3.5 h-3.5 text-blue-600" />}
                            <span className="text-sm capitalize text-gray-700">{u.role}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {manager ? manager.name : u.role === 'manager' ? 'Manager' : '—'}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" aria-label="Options">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-400 justify-end">
            <Shield className="w-3.5 h-3.5" />
            Changes are saved automatically. All updates are logged for compliance.
          </div>
        </div>
      </div>

      {/* Simple add/edit modal for Departments, Partners, Transfer Reasons */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${editTarget ? 'Edit' : 'Add'} ${activeTab.replace(/s$/, '')}`}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            required
            placeholder="Enter name..."
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          {activeTab !== 'Transfer Reasons' && (
            <Textarea
              label="Description"
              placeholder="Optional description..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
            />
          )}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>
              {editTarget ? 'Save Changes' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
