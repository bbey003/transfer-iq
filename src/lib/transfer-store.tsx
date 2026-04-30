'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Transfer } from '@/types';
import type { TransferConstraint } from '@/lib/constraints';
import { SEED_TRANSFERS, DEPARTMENTS, PARTNERS, TRANSFER_REASONS } from '@/lib/mock-data';
import { DEFAULT_CONSTRAINTS, analyzeTransfer, getAgentsNeedingCoaching } from '@/lib/constraints';

const STORE_KEY = 'tiq_transfers';
const CONSTRAINTS_KEY = 'tiq_constraints';

interface TransferStore {
  transfers: Transfer[];
  constraints: TransferConstraint[];

  // Agent actions
  submitTransfer: (data: {
    aid: string;
    department: string;
    partner: string;
    reason: string;
    notes: string;
    agentId: string;
    agentName: string;
    agentInitials: string;
    agentColor: string;
  }) => { transfer: Transfer; flagReasons: string[]; status: Transfer['status'] };

  // Manager review actions
  markValid: (transferId: string, reviewerName: string) => void;
  markInvalid: (transferId: string, reviewerName: string, managerNote?: string) => void;

  // Constraint management
  updateConstraints: (constraints: TransferConstraint[]) => void;
  toggleConstraint: (id: string) => void;

  // Derived stats (all computed live from transfers)
  stats: {
    totalThisWeek: number;
    pendingReview: number;
    invalidCount: number;
    validCount: number;
    topDept: string;
    topDeptPct: number;
  };
  agentsNeedingCoaching: Array<{ agentId: string; agentName: string; invalidCount: number }>;
}

const Ctx = createContext<TransferStore | null>(null);

function computeStats(transfers: Transfer[]) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const week = transfers.filter((t) => new Date(t.createdAt) >= weekAgo);
  const totalThisWeek = week.length;
  const pendingReview = transfers.filter((t) => t.status === 'pending_review').length;
  const invalidCount = transfers.filter((t) => t.status === 'invalid').length;
  const validCount = transfers.filter((t) => t.status === 'completed').length;

  // Top dept by volume this week
  const deptCounts: Record<string, number> = {};
  for (const t of week) {
    deptCounts[t.department] = (deptCounts[t.department] ?? 0) + 1;
  }
  const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  const topDeptPct = totalThisWeek > 0 ? Math.round(((deptCounts[topDept] ?? 0) / totalThisWeek) * 100) : 0;

  return { totalThisWeek, pendingReview, invalidCount, validCount, topDept, topDeptPct };
}

export function TransferStoreProvider({ children }: { children: React.ReactNode }) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [constraints, setConstraints] = useState<TransferConstraint[]>(DEFAULT_CONSTRAINTS);

  // Hydrate from localStorage or fall back to seed data
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      setTransfers(raw ? (JSON.parse(raw) as Transfer[]) : SEED_TRANSFERS);

      const rawC = localStorage.getItem(CONSTRAINTS_KEY);
      if (rawC) setConstraints(JSON.parse(rawC) as TransferConstraint[]);
    } catch {
      setTransfers(SEED_TRANSFERS);
    }
  }, []);

  const persist = useCallback((next: Transfer[]) => {
    setTransfers(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* quota */ }
  }, []);

  const persistConstraints = useCallback((next: TransferConstraint[]) => {
    setConstraints(next);
    try { localStorage.setItem(CONSTRAINTS_KEY, JSON.stringify(next)); } catch { /* quota */ }
  }, []);

  const submitTransfer = useCallback((data: {
    aid: string; department: string; partner: string; reason: string; notes: string;
    agentId: string; agentName: string; agentInitials: string; agentColor: string;
  }) => {
    const analysis = analyzeTransfer(data, constraints);
    const transfer: Transfer = {
      id: `t-${Date.now()}`,
      aid: data.aid.toUpperCase(),
      agentId: data.agentId,
      agentName: data.agentName,
      agentInitials: data.agentInitials,
      agentColor: data.agentColor,
      department: data.department,
      partner: data.partner,
      reason: data.reason,
      notes: data.notes,
      status: analysis.status,
      createdAt: new Date().toISOString(),
      flagged: analysis.flagReasons.length > 0,
      flagReasons: analysis.flagReasons,
      riskScore: analysis.riskScore,
    };
    persist([transfer, ...transfers]);
    return { transfer, flagReasons: analysis.flagReasons, status: analysis.status };
  }, [transfers, constraints, persist]);

  const markValid = useCallback((transferId: string, reviewerName: string) => {
    persist(transfers.map((t) =>
      t.id === transferId
        ? { ...t, status: 'completed' as const, reviewedBy: reviewerName, reviewedAt: new Date().toISOString() }
        : t
    ));
  }, [transfers, persist]);

  const markInvalid = useCallback((transferId: string, reviewerName: string, managerNote?: string) => {
    persist(transfers.map((t) =>
      t.id === transferId
        ? { ...t, status: 'invalid' as const, reviewedBy: reviewerName, reviewedAt: new Date().toISOString(), managerNote: managerNote ?? t.managerNote }
        : t
    ));
  }, [transfers, persist]);

  const updateConstraints = useCallback((next: TransferConstraint[]) => {
    persistConstraints(next);
  }, [persistConstraints]);

  const toggleConstraint = useCallback((id: string) => {
    persistConstraints(constraints.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  }, [constraints, persistConstraints]);

  const stats = computeStats(transfers);
  const agentsNeedingCoaching = getAgentsNeedingCoaching(transfers);

  return (
    <Ctx.Provider value={{
      transfers, constraints,
      submitTransfer, markValid, markInvalid,
      updateConstraints, toggleConstraint,
      stats, agentsNeedingCoaching,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTransferStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTransferStore must be used within TransferStoreProvider');
  return ctx;
}

// Helpers for chart data computed from live transfers
export function useDeptChartData(transfers: Transfer[]) {
  const counts: Record<string, number> = {};
  for (const t of transfers) {
    counts[t.department] = (counts[t.department] ?? 0) + 1;
  }
  const BLUE_SHADES = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value], i) => ({ name, value, fill: BLUE_SHADES[i] }));
}

export function useReasonsChartData(transfers: Transfer[]) {
  const counts: Record<string, number> = {};
  for (const t of transfers) {
    counts[t.reason] = (counts[t.reason] ?? 0) + 1;
  }
  const total = transfers.length || 1;
  const BLUE_SHADES = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value], i) => ({ name, value: Math.round((value / total) * 100), fill: BLUE_SHADES[i] }));
}

export function useWeeklyTrend(transfers: Transfer[]) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days[key] = 0;
  }
  for (const t of transfers) {
    const key = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (key in days) days[key]++;
  }
  return Object.entries(days).map(([date, transfers]) => ({ date, transfers }));
}

export function useAgentPatterns(transfers: Transfer[]) {
  const counts: Record<string, { name: string; initials: string; color: string; count: number }> = {};
  for (const t of transfers) {
    if (!counts[t.agentId]) {
      counts[t.agentId] = { name: t.agentName, initials: t.agentInitials, color: t.agentColor, count: 0 };
    }
    counts[t.agentId].count++;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1].count - a[1].count).slice(0, 5);
  const max = sorted[0]?.[1].count ?? 1;
  return sorted.map(([id, v], i) => ({
    rank: i + 1,
    id,
    name: v.name,
    initials: v.initials,
    color: v.color,
    recurringTransfers: v.count,
    percentage: Math.round((v.count / max) * 100),
  }));
}

// Re-export for convenience
export { DEPARTMENTS, PARTNERS, TRANSFER_REASONS };
