'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { DEPARTMENTS, PARTNERS, TRANSFER_REASONS, AGENTS } from '@/lib/mock-data';
import type { Department, Partner, TransferReason } from '@/types';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import { Plus, Pencil, MoreHorizontal, Shield } from 'lucide-react';

const TABS = ['Departments', 'Partners', 'Transfer Reasons', 'Users'] as const;
type Tab = (typeof TABS)[number];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Departments');
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Admin Settings" subtitle="Manage departments, partners, reasons, and users." />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Tabs + Add button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 border-b border-gray-200 flex-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab !== 'Users' && (
              <Button size="sm" onClick={openAdd} className="ml-4 shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Add {activeTab.replace(/s$/, '').replace('Transfer Reason', 'Reason')}
              </Button>
            )}
          </div>

          {/* Departments */}
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

          {/* Partners */}
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

          {/* Transfer Reasons */}
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

          {/* Users */}
          {activeTab === 'Users' && (
            <Card padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['User', 'Email', 'AID / BRID', 'Role', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {AGENTS.map((u) => (
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
                      <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" aria-label="Options">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {/* Compliance note */}
          <div className="flex items-center gap-2 text-xs text-gray-400 justify-end">
            <Shield className="w-3.5 h-3.5" />
            Changes are saved automatically. All updates are logged for compliance.
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
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
