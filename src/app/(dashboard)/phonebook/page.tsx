'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, Phone, Mail, Building2, Globe, User, Copy, CheckCheck } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  department?: string;
  extension?: string;
  directLine?: string;
  email?: string;
  type: 'internal' | 'external';
  partner?: string;
  notes?: string;
  initials: string;
  color: string;
}

const CONTACTS: Contact[] = [
  // Internal — Team
  { id: 'c-001', name: 'Alex Carter', role: 'Team Manager', department: 'Operations', extension: '4001', email: 'alex.carter@transferiq.internal', type: 'internal', initials: 'AC', color: 'bg-blue-500' },
  { id: 'c-002', name: 'Jessica Lee', role: 'Customer Service Agent', department: 'Operations', extension: '4021', email: 'jessica.lee@transferiq.internal', type: 'internal', initials: 'JL', color: 'bg-purple-500' },
  { id: 'c-003', name: 'Michael Chen', role: 'Customer Service Agent', department: 'Operations', extension: '4022', email: 'michael.chen@transferiq.internal', type: 'internal', initials: 'MC', color: 'bg-teal-500' },
  { id: 'c-004', name: 'Emily Rodriguez', role: 'Customer Service Agent', department: 'Operations', extension: '4023', email: 'emily.rodriguez@transferiq.internal', type: 'internal', initials: 'ER', color: 'bg-orange-500' },
  { id: 'c-005', name: 'David Park', role: 'Customer Service Agent', department: 'Operations', extension: '4024', email: 'david.park@transferiq.internal', type: 'internal', initials: 'DP', color: 'bg-blue-500' },
  { id: 'c-006', name: 'Lisa Anderson', role: 'Customer Service Agent', department: 'Operations', extension: '4025', email: 'lisa.anderson@transferiq.internal', type: 'internal', initials: 'LA', color: 'bg-pink-500' },
  { id: 'c-007', name: 'Ryan Kim', role: 'Customer Service Agent', department: 'Operations', extension: '4026', email: 'ryan.kim@transferiq.internal', type: 'internal', initials: 'RK', color: 'bg-green-500' },
  { id: 'c-008', name: 'Sarah Torres', role: 'Customer Service Agent', department: 'Operations', extension: '4027', email: 'sarah.torres@transferiq.internal', type: 'internal', initials: 'ST', color: 'bg-indigo-500' },
  // Internal — Departments
  { id: 'c-010', name: 'Fraud Team', role: 'Department Queue', department: 'Fraud', extension: '5001', type: 'internal', notes: 'Available Mon–Fri 07:00–21:00, Sat 08:00–18:00', initials: 'FT', color: 'bg-red-500' },
  { id: 'c-011', name: 'Deposits Team', role: 'Department Queue', department: 'Deposits', extension: '5002', type: 'internal', notes: 'Available Mon–Fri 08:00–20:00', initials: 'DT', color: 'bg-emerald-600' },
  { id: 'c-012', name: 'Credit Team', role: 'Department Queue', department: 'Credit', extension: '5003', type: 'internal', notes: 'Available Mon–Fri 08:00–18:00', initials: 'CT', color: 'bg-orange-600' },
  { id: 'c-013', name: 'Top of Queue', role: 'Priority Handling', department: 'Top of Queue', extension: '5000', type: 'internal', notes: 'Priority queue — use only for urgent or vulnerable customers', initials: 'TQ', color: 'bg-blue-700' },
  { id: 'c-014', name: 'Manager On Duty', role: 'Management', department: 'Manager', extension: '5099', type: 'internal', notes: 'Escalations and manager-requested calls only', initials: 'MD', color: 'bg-slate-600' },
  // External — Partners
  { id: 'c-020', name: 'Barclaycard', role: 'Credit Card Partner', partner: 'Barclaycard', directLine: '0800 161 5220', type: 'external', notes: 'Mon–Fri 08:00–20:00, Sat 09:00–17:00. Calls are recorded.', initials: 'BC', color: 'bg-blue-600' },
  { id: 'c-021', name: 'PayPlan', role: 'Debt Management Partner', partner: 'PayPlan', directLine: '0800 280 2816', type: 'external', notes: 'Free debt advice. Mon–Fri 08:30–18:00.', initials: 'PP', color: 'bg-violet-600' },
  { id: 'c-022', name: 'Transunion', role: 'Credit Bureau Partner', partner: 'Transunion', directLine: '0330 024 7574', type: 'external', notes: 'Credit file disputes and fraud victim support. Mon–Fri 09:00–17:30.', initials: 'TU', color: 'bg-teal-600' },
  { id: 'c-023', name: 'ClearScore', role: 'Credit Score Partner', partner: 'ClearScore', directLine: '0800 086 9360', type: 'external', notes: 'Credit score queries and report disputes. Available 24/7 via online support.', initials: 'CS', color: 'bg-green-600' },
  { id: 'c-024', name: 'Experian', role: 'Credit Bureau', partner: 'Experian', directLine: '0344 481 0800', type: 'external', notes: 'Credit report queries and statutory credit report requests. Mon–Fri 08:00–18:00.', initials: 'EX', color: 'bg-purple-600' },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="ml-1 p-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors" aria-label="Copy">
      {copied ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className={cn(
      'flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-colors hover:bg-gray-50/60',
      contact.type === 'internal' ? 'border-gray-200' : 'border-blue-100 bg-blue-50/20'
    )}>
      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', contact.color)}>
        {contact.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
          <span className="text-xs text-gray-400">{contact.role}</span>
        </div>
        {contact.department && (
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <Building2 className="w-3 h-3" /> {contact.department}
          </p>
        )}
        {contact.partner && (
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {contact.partner}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {contact.extension && (
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="font-mono">Ext. {contact.extension}</span>
              <CopyButton value={contact.extension} />
            </div>
          )}
          {contact.directLine && (
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="font-mono">{contact.directLine}</span>
              <CopyButton value={contact.directLine} />
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="font-mono">{contact.email}</span>
              <CopyButton value={contact.email} />
            </div>
          )}
        </div>
        {contact.notes && (
          <p className="text-xs text-gray-400 mt-1 italic">{contact.notes}</p>
        )}
      </div>
    </div>
  );
}

const TABS = ['All', 'Internal', 'External'] as const;

export default function PhoneBookPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('All');

  const filtered = CONTACTS.filter((c) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Internal' && c.type === 'internal') ||
      (activeTab === 'External' && c.type === 'external');
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      (c.department ?? '').toLowerCase().includes(q) ||
      (c.partner ?? '').toLowerCase().includes(q) ||
      (c.extension ?? '').includes(q) ||
      (c.directLine ?? '').includes(q);
    return matchesTab && matchesSearch;
  });

  const internalContacts = filtered.filter((c) => c.type === 'internal' && !c.department?.includes('Queue') && c.role !== 'Department Queue' && c.role !== 'Priority Handling' && c.role !== 'Management');
  const internalDepts = filtered.filter((c) => c.type === 'internal' && (c.role === 'Department Queue' || c.role === 'Priority Handling' || c.role === 'Management'));
  const externalContacts = filtered.filter((c) => c.type === 'external');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Phone Book"
        subtitle="Internal team contacts and external partner numbers."
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4 max-w-4xl">
          {/* Search + Tabs */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name, department, or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 w-full focus:outline-none"
            />
          </div>

          <div className="flex gap-1 border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No contacts match your search.</p>
          )}

          {/* Internal team */}
          {(activeTab === 'All' || activeTab === 'Internal') && internalContacts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Team Members</h2>
              </div>
              <div className="space-y-2">
                {internalContacts.map((c) => <ContactCard key={c.id} contact={c} />)}
              </div>
            </section>
          )}

          {/* Internal departments */}
          {(activeTab === 'All' || activeTab === 'Internal') && internalDepts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Department Queues</h2>
              </div>
              <div className="space-y-2">
                {internalDepts.map((c) => <ContactCard key={c.id} contact={c} />)}
              </div>
            </section>
          )}

          {/* External partners */}
          {(activeTab === 'All' || activeTab === 'External') && externalContacts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">External Partner Numbers</h2>
              </div>
              <Card padding="none" className="overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {externalContacts.map((c) => (
                    <div key={c.id} className="px-4 py-3.5 hover:bg-gray-50/60 transition-colors">
                      <ContactCard contact={c} />
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
