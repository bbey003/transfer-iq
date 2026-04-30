'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NoteTemplate {
  id: string;
  label: string;
  department: string; // '' = applies to all departments
  text: string;
}

const DEFAULT_TEMPLATES: NoteTemplate[] = [
  {
    id: 'qt-1',
    label: 'Fraud — Unrecognised transaction',
    department: 'Fraud',
    text: 'Customer reported an unrecognised transaction. Identity verified. Transferring as a fraud concern.',
  },
  {
    id: 'qt-2',
    label: 'Fraud — Lost or stolen card',
    department: 'Fraud',
    text: 'Customer\'s card has been reported lost or stolen. Identity verified. Urgent fraud transfer required.',
  },
  {
    id: 'qt-3',
    label: 'Deposits — Hold not in FAQ',
    department: 'Deposits',
    text: 'Checked deposit FAQ and policy pages — hold type not covered. Transferring for specialist support.',
  },
  {
    id: 'qt-4',
    label: 'Deposits — Not reflected after processing',
    department: 'Deposits',
    text: 'Customer\'s deposit has not reflected after the standard processing window. Checked FAQ — no resolution. Transferring for investigation.',
  },
  {
    id: 'qt-5',
    label: 'Partners — Query not in FAQ',
    department: 'Partners',
    text: 'Customer has a query regarding their partner product that requires direct partner involvement. Checked partner FAQ — query not documented. Transferring for specialist support.',
  },
  {
    id: 'qt-6',
    label: 'Manager — Customer request',
    department: 'Manager',
    text: 'Customer explicitly requested to speak with a manager. De-escalation attempted. Transferring as per customer request.',
  },
  {
    id: 'qt-7',
    label: 'Manager — Complaint escalation',
    department: 'Manager',
    text: 'Customer is raising a formal complaint that is beyond my authorisation level. De-escalation attempted. Transferring for complaint handling.',
  },
  {
    id: 'qt-8',
    label: 'Credit — Account lockout',
    department: 'Credit',
    text: 'Customer locked out after failed authentication attempts. Password reset link not received to email on file. Transferring for account access support.',
  },
  {
    id: 'qt-9',
    label: 'Top of Queue — Vulnerable customer',
    department: 'Top of Queue',
    text: 'Customer has disclosed a vulnerability requiring priority support. Transferring to Top of Queue.',
  },
];

function storageKey(userId: string) {
  return `tiq_quick_notes_${userId}`;
}

export function useQuickNotes(userId: string) {
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    try {
      const raw = localStorage.getItem(storageKey(userId));
      setTemplates(raw ? (JSON.parse(raw) as NoteTemplate[]) : DEFAULT_TEMPLATES);
    } catch {
      setTemplates(DEFAULT_TEMPLATES);
    }
    setLoaded(true);
  }, [userId]);

  const persist = useCallback((next: NoteTemplate[]) => {
    setTemplates(next);
    try { localStorage.setItem(storageKey(userId), JSON.stringify(next)); } catch { /* quota */ }
  }, [userId]);

  const addTemplate = useCallback((t: Omit<NoteTemplate, 'id'>) => {
    persist([...templates, { ...t, id: `qt-${Date.now()}` }]);
  }, [templates, persist]);

  const updateTemplate = useCallback((id: string, updates: Partial<Omit<NoteTemplate, 'id'>>) => {
    persist(templates.map((t) => t.id === id ? { ...t, ...updates } : t));
  }, [templates, persist]);

  const deleteTemplate = useCallback((id: string) => {
    persist(templates.filter((t) => t.id !== id));
  }, [templates, persist]);

  return { templates, loaded, addTemplate, updateTemplate, deleteTemplate };
}
