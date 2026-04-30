export interface TransferConstraint {
  id: string;
  name: string;
  description: string;
  type: 'notes_required' | 'reason_dept_flag' | 'reason_always_valid' | 'min_notes_length' | 'partner_required';
  department?: string;
  reason?: string;
  minNotesLength?: number;
  severity: 'review' | 'coaching_risk';
  isActive: boolean;
}

export interface AnalysisResult {
  status: 'completed' | 'pending_review';
  flagReasons: string[];
  riskScore: number; // 0-100
  aiExplanation?: string;
}

export const DEFAULT_CONSTRAINTS: TransferConstraint[] = [
  {
    id: 'c-1',
    name: 'Info/Clarification requires notes',
    description: 'Transfers for Information/Clarification must include notes explaining what was attempted first.',
    type: 'notes_required',
    reason: 'Information / Clarification',
    severity: 'review',
    isActive: true,
  },
  {
    id: 'c-2',
    name: 'Manager escalation requires justification',
    description: 'Transfers to the Manager department must include a reason why the agent could not resolve.',
    type: 'notes_required',
    department: 'Manager',
    severity: 'review',
    isActive: true,
  },
  {
    id: 'c-3',
    name: 'Partners info gap — minimum 30 chars',
    description: 'Transfers to Partners for Information/Clarification must have at least 30 characters of notes.',
    type: 'min_notes_length',
    department: 'Partners',
    reason: 'Information / Clarification',
    minNotesLength: 30,
    severity: 'review',
    isActive: true,
  },
  {
    id: 'c-4',
    name: 'Account Access requires detail',
    description: 'Account Access transfers must describe the issue in at least 20 characters.',
    type: 'min_notes_length',
    reason: 'Account Access',
    minNotesLength: 20,
    severity: 'review',
    isActive: true,
  },
  {
    id: 'c-5',
    name: 'Customer Request — always valid',
    description: 'Customer-requested transfers are automatically valid.',
    type: 'reason_always_valid',
    reason: 'Customer Request',
    severity: 'review',
    isActive: true,
  },
  {
    id: 'c-6',
    name: 'Fraud Concern — always valid',
    description: 'Fraud-related transfers are automatically valid for compliance reasons.',
    type: 'reason_always_valid',
    reason: 'Fraud Concern',
    severity: 'review',
    isActive: true,
  },
  {
    id: 'c-7',
    name: 'Complaint Escalation — always valid',
    description: 'Complaint escalations are automatically valid.',
    type: 'reason_always_valid',
    reason: 'Complaint Escalation',
    severity: 'review',
    isActive: true,
  },
  {
    id: 'c-8',
    name: 'System/Process Issue — always valid',
    description: 'System and process issues are outside agent control and automatically valid.',
    type: 'reason_always_valid',
    reason: 'System / Process Issue',
    severity: 'review',
    isActive: true,
  },
];

export function analyzeTransfer(
  data: { department: string; reason: string; partner: string; notes: string },
  constraints: TransferConstraint[]
): AnalysisResult {
  const active = constraints.filter((c) => c.isActive);
  const flagReasons: string[] = [];

  // Check if always valid
  const alwaysValid = active.find(
    (c) =>
      c.type === 'reason_always_valid' &&
      (!c.reason || c.reason === data.reason) &&
      (!c.department || c.department === data.department)
  );
  if (alwaysValid) {
    return { status: 'completed', flagReasons: [], riskScore: 0 };
  }

  for (const constraint of active) {
    const deptMatch = !constraint.department || constraint.department === data.department;
    const reasonMatch = !constraint.reason || constraint.reason === data.reason;
    if (!deptMatch || !reasonMatch) continue;

    if (constraint.type === 'notes_required') {
      if (!data.notes || data.notes.trim().length < 10) {
        flagReasons.push(`Notes required: ${constraint.description}`);
      }
    }

    if (constraint.type === 'min_notes_length' && constraint.minNotesLength) {
      if (data.notes.trim().length < constraint.minNotesLength) {
        flagReasons.push(
          `Insufficient detail: notes must be at least ${constraint.minNotesLength} characters for ${constraint.reason ?? constraint.department} transfers.`
        );
      }
    }
  }

  const riskScore = Math.min(100, flagReasons.length * 35);
  const status = flagReasons.length > 0 ? 'pending_review' : 'completed';
  return { status, flagReasons, riskScore };
}

// Returns agents who have >= threshold invalid transfers in last N days
export function getAgentsNeedingCoaching(
  transfers: Array<{ agentId: string; agentName: string; status: string; createdAt: string }>,
  threshold = 3,
  windowDays = 7
): Array<{ agentId: string; agentName: string; invalidCount: number }> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);

  const counts: Record<string, { agentName: string; count: number }> = {};
  for (const t of transfers) {
    if (t.status === 'invalid' && new Date(t.createdAt) >= cutoff) {
      if (!counts[t.agentId]) counts[t.agentId] = { agentName: t.agentName, count: 0 };
      counts[t.agentId].count++;
    }
  }

  return Object.entries(counts)
    .filter(([, v]) => v.count >= threshold)
    .map(([agentId, v]) => ({ agentId, agentName: v.agentName, invalidCount: v.count }));
}
