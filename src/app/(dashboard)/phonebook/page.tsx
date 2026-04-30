'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Search, Phone, Globe, Building2, Plus, Pencil, Trash2, Copy, CheckCheck } from 'lucide-react';

interface PhoneEntry {
  id: string;
  name: string;
  number: string;
  type: 'internal' | 'external';
  category?: string;
  notes?: string;
  isCustom?: boolean;
}

const DEFAULT_ENTRIES: PhoneEntry[] = [
  // Internal department queues
  { id: 'int-001', name: 'Fraud Team', number: 'Ext. 5001', type: 'internal', category: 'Department', notes: 'Mon–Fri 07:00–21:00, Sat 08:00–18:00' },
  { id: 'int-002', name: 'Deposits Team', number: 'Ext. 5002', type: 'internal', category: 'Department', notes: 'Mon–Fri 08:00–20:00' },
  { id: 'int-003', name: 'Credit Team', number: 'Ext. 5003', type: 'internal', category: 'Department', notes: 'Mon–Fri 08:00–18:00' },
  { id: 'int-004', name: 'Partners Team', number: 'Ext. 5004', type: 'internal', category: 'Department', notes: 'Mon–Fri 08:00–19:00' },
  { id: 'int-005', name: 'Top of Queue', number: 'Ext. 5000', type: 'internal', category: 'Priority', notes: 'Priority queue — use for urgent or vulnerable customers only' },
  { id: 'int-006', name: 'Manager on Duty', number: 'Ext. 5099', type: 'internal', category: 'Management', notes: 'For complaint escalations and manager-requested transfers' },
  { id: 'int-007', name: 'IT Support', number: 'Ext. 5200', type: 'internal', category: 'Support', notes: 'System issues and access requests. Mon–Fri 08:00–17:00' },
  { id: 'int-008', name: 'Compliance', number: 'Ext. 5300', type: 'internal', category: 'Support', notes: 'Regulatory queries and FCA-related escalations' },
  // External partners
  { id: 'ext-001', name: 'Barclaycard', number: '0800 161 5220', type: 'external', category: 'Partner', notes: 'Mon–Fri 08:00–20:00, Sat 09:00–17:00' },
  { id: 'ext-002', name: 'PayPlan', number: '0800 280 2816', type: 'external', category: 'Partner', notes: 'Free debt advice. Mon–Fri 08:30–18:00' },
  { id: 'ext-003', name: 'Transunion', number: '0330 024 7574', type: 'external', category: 'Partner', notes: 'Credit file disputes and fraud victim support. Mon–Fri 09:00–17:30' },
  { id: 'ext-004', name: 'ClearScore', number: '0800 086 9360', type: 'external', category: 'Partner', notes: 'Credit score queries. Available 24/7 via online support' },
  { id: 'ext-005', name: 'Experian', number: '0344 481 0800', type: 'external', category: 'Partner', notes: 'Credit reports. Mon–Fri 08:00–18:00' },
];

const STORAGE_KEY = 'tiq_phonebook_custom';

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="ml-1 p-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors"
      aria-label="Copy"
    >
      {copied ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function EntryRow({ entry, onEdit, onDelete }: { entry: PhoneEntry; onEdit?: () => void; onDelete?: () => void }) {
  const Icon = entry.type === 'internal' ? Building2 : Globe;
  return (
    <div className={cn(
      'flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-colors hover:bg-gray-50/60',
      entry.type === 'internal' ? 'border-gray-200' : 'border-blue-100 bg-blue-50/20'
    )}>
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
        entry.type === 'internal' ? 'bg-slate-100' : 'bg-blue-100'
      )}>
        <Icon className={cn('w-4 h-4', entry.type === 'internal' ? 'text-slate-600' : 'text-blue-600')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900">{entry.name}</p>
          {entry.category && (
            <span className="text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">{entry.category}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-xs font-mono text-gray-700">{entry.number}</span>
          <CopyButton value={entry.number} />
        </div>
        {entry.notes && <p className="text-xs text-gray-400 mt-1 italic">{entry.notes}</p>}
      </div>
      {entry.isCustom && (
        <div className="flex items-center gap-0.5 shrink-0">
          {onEdit && (
            <button onClick={onEdit} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" aria-label="Edit">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500" aria-label="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const TABS = ['All', 'Internal', 'External', 'My Numbers'] as const;

export default function PhoneBookPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('All');
  const [customEntries, setCustomEntries] = useState<PhoneEntry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<PhoneEntry | null>(null);
  const [form, setForm] = useState({ name: '', number: '', type: 'internal' as 'internal' | 'external', notes: '' });
  const { success } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCustomEntries(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const persistCustom = (next: PhoneEntry[]) => {
    setCustomEntries(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
  };

  const openAdd = () => {
    setEditEntry(null);
    setForm({ name: '', number: '', type: 'internal', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (entry: PhoneEntry) => {
    setEditEntry(entry);
    setForm({ name: entry.name, number: entry.number, type: entry.type, notes: entry.notes ?? '' });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.number.trim()) return;
    if (editEntry) {
      persistCustom(customEntries.map((e) => e.id === editEntry.id
        ? { ...e, name: form.name.trim(), number: form.number.trim(), type: form.type, notes: form.notes.trim() }
        : e
      ));
      success('Contact updated');
    } else {
      const newEntry: PhoneEntry = {
        id: `custom-${Date.now()}`,
        name: form.name.trim(),
        number: form.number.trim(),
        type: form.type,
        notes: form.notes.trim() || undefined,
        isCustom: true,
      };
      persistCustom([...customEntries, newEntry]);
      success('Contact added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    persistCustom(customEntries.filter((e) => e.id !== id));
    success('Contact removed');
  };

  const allEntries = [...DEFAULT_ENTRIES, ...customEntries];

  const filtered = allEntries.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch = !search || e.name.toLowerCase().includes(q) || e.number.toLowerCase().includes(q) || (e.category ?? '').toLowerCase().includes(q);
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Internal' && e.type === 'internal' && !e.isCustom) ||
      (activeTab === 'External' && e.type === 'external' && !e.isCustom) ||
      (activeTab === 'My Numbers' && e.isCustom);
    return matchesSearch && matchesTab;
  });

  const internalEntries = filtered.filter((e) => e.type === 'internal' && !e.isCustom);
  const externalEntries = filtered.filter((e) => e.type === 'external' && !e.isCustom);
  const myEntries = filtered.filter((e) => e.isCustom);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Phone Book" subtitle="Internal department numbers and external partner contacts." />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4 max-w-4xl">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 w-full focus:outline-none"
            />
          </div>

          {/* Tabs + Add button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
                    activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab}
                  {tab === 'My Numbers' && customEntries.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">{customEntries.length}</span>
                  )}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={openAdd} className="shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add Number
            </Button>
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No contacts match your search.</p>
          )}

          {/* Internal departments */}
          {(activeTab === 'All' || activeTab === 'Internal') && internalEntries.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Internal Departments</h2>
              </div>
              <div className="space-y-2">
                {internalEntries.map((e) => <EntryRow key={e.id} entry={e} />)}
              </div>
            </section>
          )}

          {/* External partners */}
          {(activeTab === 'All' || activeTab === 'External') && externalEntries.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">External Partner Numbers</h2>
              </div>
              <div className="space-y-2">
                {externalEntries.map((e) => <EntryRow key={e.id} entry={e} />)}
              </div>
            </section>
          )}

          {/* My custom numbers */}
          {(activeTab === 'All' || activeTab === 'My Numbers') && myEntries.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">My Numbers</h2>
              </div>
              <div className="space-y-2">
                {myEntries.map((e) => (
                  <EntryRow key={e.id} entry={e} onEdit={() => openEdit(e)} onDelete={() => handleDelete(e.id)} />
                ))}
              </div>
            </section>
          )}

          {activeTab === 'My Numbers' && myEntries.length === 0 && !search && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-400 mb-3">No saved numbers yet.</p>
              <Button size="sm" variant="outline" onClick={openAdd}>
                <Plus className="w-4 h-4 mr-1" /> Add your first number
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editEntry ? 'Edit Contact' : 'Add Number'} size="sm">
        <div className="space-y-3">
          <Input
            label="Name"
            required
            placeholder="e.g. Collections Team"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Number / Extension"
            required
            placeholder="e.g. Ext. 5050 or 0800 123 456"
            value={form.number}
            onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
          />
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
            <div className="flex gap-3">
              {(['internal', 'external'] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={() => setForm((f) => ({ ...f, type: t }))}
                    className="accent-blue-600"
                  />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>
          <Input
            label="Notes (optional)"
            placeholder="e.g. Available Mon–Fri 09:00–17:00"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={!form.name.trim() || !form.number.trim()}>
              {editEntry ? 'Save Changes' : 'Add Contact'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
